package com.banfico.bankingsystem.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banfico.bankingsystem.dto.AccountRequestDTO;
import com.banfico.bankingsystem.dto.AccountResponseDTO;
import com.banfico.bankingsystem.dto.AccountResponseDTO.CustomerSummary;
import com.banfico.bankingsystem.entity.Account;
import com.banfico.bankingsystem.entity.Customer;
import com.banfico.bankingsystem.exception.BadRequestException;
import com.banfico.bankingsystem.exception.ResourceNotFoundException;
import com.banfico.bankingsystem.repository.AccountRepository;
import com.banfico.bankingsystem.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AccountService
 *
 * Business logic for all Account operations.
 *
 * Account number generation:
 *   We generate a unique 12-digit account number using the current
 *   timestamp + a random suffix, then verify it doesn't already exist.
 *   Format: BNK + yyyyMMdd + 5 random digits  → e.g. BNK202408280001
 *   In production, a dedicated sequence or UUID-based scheme is used.
 *
 * Why validate customer existence before creating an account?
 *   The FK constraint in PostgreSQL would also catch this, but it gives
 *   a cryptic DB error. Checking explicitly lets us return a clean 404
 *   with a readable message before hitting the database constraint.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    // ---------------------------------------------------------------
    // CREATE
    // POST /api/accounts
    // ---------------------------------------------------------------

    /**
     * Creates a new bank account for an existing customer.
     *
     * Flow:
     *   1. Verify customer exists → 404 if not
     *   2. Validate initial deposit is not negative
     *   3. Generate unique account number
     *   4. Build Account entity, set balance = initialDeposit
     *   5. Save and return DTO
     */
    @Transactional
    public AccountResponseDTO createAccount(AccountRequestDTO dto) {
        log.debug("Creating account for customerId: {}", dto.getCustomerId());

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", dto.getCustomerId()));

        if (dto.getInitialDeposit().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Initial deposit cannot be negative");
        }

        String accountNumber = generateUniqueAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(dto.getAccountType())
                .balance(dto.getInitialDeposit())
                .status(Account.AccountStatus.ACTIVE)
                .customer(customer)
                .build();

        Account saved = accountRepository.save(account);
        log.info("Account created: {} for customerId: {}", accountNumber, dto.getCustomerId());
        return toResponseDTO(saved);
    }

    // ---------------------------------------------------------------
    // READ ALL
    // GET /api/accounts
    // ---------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<AccountResponseDTO> getAllAccounts() {
        log.debug("Fetching all accounts");
        return accountRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------
    // READ ONE
    // GET /api/accounts/{id}
    // ---------------------------------------------------------------
    @Transactional(readOnly = true)
    public AccountResponseDTO getAccountById(Long accountId) {
        log.debug("Fetching account with id: {}", accountId);
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));
        return toResponseDTO(account);
    }

    // ---------------------------------------------------------------
    // READ BY CUSTOMER
    // GET /api/accounts?customerId={id}  (optional filter)
    // ---------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<AccountResponseDTO> getAccountsByCustomerId(Long customerId) {
        log.debug("Fetching accounts for customerId: {}", customerId);
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer", "id", customerId);
        }
        return accountRepository.findByCustomer_Id(customerId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------
    // HELPER — generate a unique account number
    // Format: BNK + yyyyMMddHHmmss + 2 random digits
    // Loop ensures uniqueness even on collision (rare but safe)
    // ---------------------------------------------------------------
    private String generateUniqueAccountNumber() {
        String accountNumber;
        int attempts = 0;
        do {
            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int random = (int) (Math.random() * 90) + 10; // 10–99
            accountNumber = "BNK" + timestamp + random;
            attempts++;
            if (attempts > 10) {
                throw new RuntimeException("Failed to generate unique account number after 10 attempts");
            }
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    // ---------------------------------------------------------------
    // HELPER — Entity → DTO mapping
    // ---------------------------------------------------------------
    private AccountResponseDTO toResponseDTO(Account account) {
        CustomerSummary customerSummary = CustomerSummary.builder()
                .id(account.getCustomer().getId())
                .fullName(account.getCustomer().getFullName())
                .email(account.getCustomer().getEmail())
                .build();

        return AccountResponseDTO.builder()
                .accountId(account.getAccountId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .status(account.getStatus())
                .customer(customerSummary)
                .build();
    }
}
