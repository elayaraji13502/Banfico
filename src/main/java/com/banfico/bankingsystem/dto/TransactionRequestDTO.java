package com.banfico.bankingsystem.dto;

import java.math.BigDecimal;

import com.banfico.bankingsystem.entity.Transaction.TransactionType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * TransactionRequestDTO
 *
 * Used for POST /api/accounts/{id}/transactions
 *
 * The accountId comes from the URL path variable, not the body.
 * The client sends: amount, transactionType, and an optional description.
 *
 * @DecimalMin("0.01") → amount must be at least 0.01 (no zero or negative)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequestDTO {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Transaction type is required (CREDIT or DEBIT)")
    private TransactionType transactionType;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;
}
