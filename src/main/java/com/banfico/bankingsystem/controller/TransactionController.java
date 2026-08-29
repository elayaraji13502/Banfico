package com.banfico.bankingsystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banfico.bankingsystem.dto.ApiResponse;
import com.banfico.bankingsystem.dto.TransactionRequestDTO;
import com.banfico.bankingsystem.dto.TransactionResponseDTO;
import com.banfico.bankingsystem.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * TransactionController
 *
 * Handles transaction endpoints nested under /api/accounts/{accountId}.
 * The account ID comes from the URL path, not the request body.
 *
 * Why nested under /api/accounts/{accountId}?
 *   Transactions are always in the context of a specific account.
 *   The URL structure /api/accounts/5/transactions clearly expresses:
 *   "the transactions belonging to account 5".
 *   This is a REST best practice for owned sub-resources.
 *
 * Endpoints:
 *   POST /api/accounts/{accountId}/transactions  → post a CREDIT or DEBIT
 *   GET  /api/accounts/{accountId}/transactions  → list all transactions (newest first)
 */
@Slf4j
@RestController
@RequestMapping("/api/accounts/{accountId}/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * POST /api/accounts/{accountId}/transactions
     *
     * Posts a CREDIT (deposit) or DEBIT (withdrawal) on the account.
     *
     * Returns:
     *   201 Created → transaction was successfully recorded
     *   400         → account is not ACTIVE, or invalid request body
     *   404         → account not found
     *   422         → insufficient funds for a DEBIT
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponseDTO>> postTransaction(
            @PathVariable Long accountId,
            @Valid @RequestBody TransactionRequestDTO request) {

        TransactionResponseDTO transaction = transactionService.postTransaction(accountId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction posted successfully", transaction));
    }

    /**
     * GET /api/accounts/{accountId}/transactions
     *
     * Returns all transactions for the account, ordered newest first.
     *
     * Returns:
     *   200 OK → list of transactions (can be empty if none yet)
     *   404    → account not found
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionResponseDTO>>> getTransactions(
            @PathVariable Long accountId) {

        List<TransactionResponseDTO> transactions =
                transactionService.getTransactionsByAccountId(accountId);
        return ResponseEntity.ok(
                ApiResponse.success("Transactions retrieved successfully", transactions));
    }
}
