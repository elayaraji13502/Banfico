package com.banfico.bankingsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * InsufficientFundsException
 *
 * Thrown when a DEBIT transaction amount exceeds the account balance.
 * Maps to HTTP 422 Unprocessable Entity.
 *
 * HTTP 422 is the correct status for this case:
 *   - The request is syntactically valid (400 doesn't apply)
 *   - It's not a missing resource (404 doesn't apply)
 *   - The business rule "balance must not go negative" was violated
 *
 * Usage example in TransactionService:
 *   if (transactionType == DEBIT && account.getBalance().compareTo(amount) < 0) {
 *       throw new InsufficientFundsException(account.getAccountNumber(), account.getBalance());
 *   }
 */
@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class InsufficientFundsException extends RuntimeException {

    public InsufficientFundsException(String accountNumber, java.math.BigDecimal balance) {
        super(String.format(
                "Insufficient funds in account %s. Available balance: %.2f",
                accountNumber, balance));
    }

    public InsufficientFundsException(String message) {
        super(message);
    }
}
