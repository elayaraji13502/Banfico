package com.banfico.bankingsystem.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banfico.bankingsystem.dto.TransactionRequestDTO;
import com.banfico.bankingsystem.dto.TransactionResponseDTO;
import com.banfico.bankingsystem.entity.Account;
import com.banfico.bankingsystem.entity.Account.AccountStatus;
import com.banfico.bankingsystem.entity.Transaction;
import com.banfico.bankingsystem.entity.Transaction.TransactionType;
import com.banfico.bankingsystem.exception.BadRequestException;
import com.banfico.bankingsystem.exception.InsufficientFundsException;
import com.banfico.bankingsystem.exception.ResourceNotFoundException;
import com.banfico.bankingsystem.repository.AccountRepository;
import com.banfico.bankingsystem.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * TransactionService
 *
 * Handles CREDIT (deposit) and DEBIT (withdrawal) operations.
 *
 * Why is @Transactional critical here?
 *   A transaction does TWO things atomically:
 *     1. Updates the account balance
 *     2. Creates a transaction record
 *
 *   If step 2 fails after step 1 completes, the balance would be
 *   wrong with no record of why. @Transactional ensures BOTH succeed
 *   or BOTH are rolled back — the database is never left inconsistent.
 *
 * BigDecimal.compareTo() vs equals():
 *   Never use equals() to compare BigDecimals for value.
 *   new BigDecimal("2.0").equals(new BigDecimal("2.00")) → FALSE ❌
 *   new BigDecimal("2.0").compareTo(new BigDecimal("2.00")) == 0 → TRUE ✅
 *   compareTo returns: -1 (less), 0 (equal), 1 (greater)
 *
 * Balance update logic:
 *   CREDIT: newBalance = currentBalance + amount  (money in)
 *   DEBIT:  newBalance = currentBalance - amount  (money out)
 *           → validate: currentBalance >= amount first
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    // ---------------------------------------------------------------
    // POST a transaction
    // POST /api/accounts/{accountId}/transactions
    // ---------------------------------------------------------------

    /**
     * Posts a CREDIT or DEBIT transaction against an account.
     *
     * Flow:
     *   1. Find account by ID → 404 if not found
     *   2. Check account is ACTIVE → 400 if suspended/closed
     *   3. If DEBIT → check balance is sufficient → 422 if not
     *   4. Calculate new balance
     *   5. Update account balance (saved automatically via @Transactional)
     *   6. Create and save Transaction record with balanceAfter snapshot
     *   7. Return TransactionResponseDTO
     */
    @Transactional
    public TransactionResponseDTO postTransaction(Long accountId, TransactionRequestDTO dto) {
        log.debug("Posting {} of {} on accountId: {}",
                dto.getTransactionType(), dto.getAmount(), accountId);

        // Step 1 — fetch account with pessimistic write lock to prevent race conditions
        Account account = accountRepository.findByIdForUpdate(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));

        // Step 2 — only ACTIVE accounts can transact
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException(
                    "Transactions are not allowed on account with status: " + account.getStatus());
        }

        BigDecimal amount = dto.getAmount();
        BigDecimal currentBalance = account.getBalance();
        BigDecimal newBalance;

        // Step 3 & 4 — apply business rule and calculate new balance
        if (dto.getTransactionType() == TransactionType.DEBIT) {
            // compareTo returns -1 if currentBalance < amount
            if (currentBalance.compareTo(amount) < 0) {
                throw new InsufficientFundsException(account.getAccountNumber(), currentBalance);
            }
            newBalance = currentBalance.subtract(amount);
        } else {
            // CREDIT
            newBalance = currentBalance.add(amount);
        }

        // Step 5 — persist the new balance on the account
        account.setBalance(newBalance);
        accountRepository.save(account);

        // Step 6 — record the transaction
        Transaction transaction = Transaction.builder()
                .amount(amount)
                .transactionType(dto.getTransactionType())
                .description(dto.getDescription())
                .balanceAfter(newBalance)
                .account(account)
                .build();

        Transaction saved = transactionRepository.save(transaction);
        log.info("Transaction {} completed on account {}. New balance: {}",
                saved.getTransactionId(), account.getAccountNumber(), newBalance);

        return toResponseDTO(saved);
    }

    // ---------------------------------------------------------------
    // GET transactions for an account
    // GET /api/accounts/{accountId}/transactions
    // ---------------------------------------------------------------

    /**
     * Returns all transactions for a given account, newest first.
     *
     * We verify the account exists first so we return 404 on an
     * unknown accountId rather than silently returning an empty list
     * (which would mislead the client into thinking the account exists
     * but has no transactions).
     */
    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getTransactionsByAccountId(Long accountId) {
        log.debug("Fetching transactions for accountId: {}", accountId);

        if (!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Account", "id", accountId);
        }

        return transactionRepository
                .findByAccount_AccountIdOrderByTimestampDesc(accountId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------
    // HELPER — Entity → DTO mapping
    // ---------------------------------------------------------------
    private TransactionResponseDTO toResponseDTO(Transaction t) {
        return TransactionResponseDTO.builder()
                .transactionId(t.getTransactionId())
                .amount(t.getAmount())
                .transactionType(t.getTransactionType())
                .description(t.getDescription())
                .balanceAfter(t.getBalanceAfter())
                .timestamp(t.getTimestamp())
                .accountId(t.getAccount().getAccountId())
                .accountNumber(t.getAccount().getAccountNumber())
                .build();
    }
}
