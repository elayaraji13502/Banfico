package com.banfico.bankingsystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.banfico.bankingsystem.dto.AccountRequestDTO;
import com.banfico.bankingsystem.dto.AccountResponseDTO;
import com.banfico.bankingsystem.dto.ApiResponse;
import com.banfico.bankingsystem.service.AccountService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AccountController
 *
 * Handles all HTTP requests for Account resources.
 *
 * @RequestParam(required = false):
 *   Optional query parameter. If ?customerId=5 is provided,
 *   returns only accounts for that customer.
 *   If omitted, returns all accounts.
 *   Example: GET /api/accounts?customerId=5
 *
 * Note: Transaction endpoints (POST + GET /api/accounts/{id}/transactions)
 * are handled in TransactionController to keep concerns separated.
 */
@Slf4j
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    /**
     * POST /api/accounts
     * Create a new bank account for a customer.
     * Returns 201 Created with the new account details.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponseDTO>> createAccount(
            @Valid @RequestBody AccountRequestDTO request) {

        AccountResponseDTO created = accountService.createAccount(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", created));
    }

    /**
     * GET /api/accounts
     * GET /api/accounts?customerId={id}
     *
     * Without customerId → returns all accounts in the system.
     * With customerId    → returns only accounts for that customer.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponseDTO>>> getAccounts(
            @RequestParam(required = false) Long customerId) {

        List<AccountResponseDTO> accounts = (customerId != null)
                ? accountService.getAccountsByCustomerId(customerId)
                : accountService.getAllAccounts();

        return ResponseEntity.ok(
                ApiResponse.success("Accounts retrieved successfully", accounts));
    }

    /**
     * GET /api/accounts/{id}
     * Retrieve a single account by its accountId.
     * Returns 404 if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponseDTO>> getAccountById(
            @PathVariable Long id) {

        AccountResponseDTO account = accountService.getAccountById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Account retrieved successfully", account));
    }
}
