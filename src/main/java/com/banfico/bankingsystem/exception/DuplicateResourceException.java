package com.banfico.bankingsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * DuplicateResourceException
 *
 * Thrown when a client tries to create a resource that already exists.
 * Maps to HTTP 409 Conflict.
 *
 * Examples of when to throw this:
 *   - Creating a customer with an email that already exists
 *   - Creating a customer with a phone number that already exists
 *   - Adding a beneficiary with an account number the customer already saved
 *
 * HTTP 409 Conflict is the correct status code for duplicate resource
 * attempts — more specific than 400 Bad Request.
 *
 * Usage example:
 *   if (customerRepository.existsByEmail(dto.getEmail())) {
 *       throw new DuplicateResourceException("Customer", "email", dto.getEmail());
 *   }
 *   → "Customer already exists with email: john@example.com"
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s already exists with %s: %s", resourceName, fieldName, fieldValue));
    }

    public DuplicateResourceException(String message) {
        super(message);
    }
}
