package com.banfico.bankingsystem.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.banfico.bankingsystem.entity.Transaction.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * TransactionResponseDTO
 *
 * Returned by POST /api/accounts/{id}/transactions
 * and GET /api/accounts/{id}/transactions
 *
 * balanceAfter → shows the account balance immediately after
 * this transaction was applied. Useful for displaying mini-statements.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDTO {

    private Long transactionId;
    private BigDecimal amount;
    private TransactionType transactionType;
    private String description;
    private BigDecimal balanceAfter;
    private LocalDateTime timestamp;

    // Which account this transaction belongs to
    private Long accountId;
    private String accountNumber;
}
