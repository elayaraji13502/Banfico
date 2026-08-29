package com.banfico.bankingsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * BadRequestException
 *
 * Thrown when the client sends invalid or logically incorrect data.
 * Maps to HTTP 400 Bad Request.
 *
 * Examples of when to throw this:
 *   - Transfer amount is zero or negative
 *   - Trying to withdraw more than the account balance
 *   - Invalid account type provided
 *
 * Usage example:
 *   if (amount <= 0) {
 *       throw new BadRequestException("Transfer amount must be greater than zero");
 *   }
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }

}
