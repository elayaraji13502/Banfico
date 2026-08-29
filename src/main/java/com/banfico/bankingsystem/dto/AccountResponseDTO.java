package com.banfico.bankingsystem.dto;

import java.math.BigDecimal;

import com.banfico.bankingsystem.entity.Account.AccountStatus;
import com.banfico.bankingsystem.entity.Account.AccountType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AccountResponseDTO
 *
 * Returned by GET /api/accounts, GET /api/accounts/{id},
 * POST /api/accounts
 *
 * Includes a nested CustomerSummary (id + name only) instead of
 * the full CustomerResponseDTO. This is a common pattern — provide
 * just enough context to identify the owner without over-fetching.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponseDTO {

    private Long accountId;
    private String accountNumber;
    private AccountType accountType;
    private BigDecimal balance;
    private AccountStatus status;

    // Nested summary — tells the client who owns this account
    // without returning every customer field
    private CustomerSummary customer;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerSummary {
        private Long id;
        private String fullName;
        private String email;
    }
}
