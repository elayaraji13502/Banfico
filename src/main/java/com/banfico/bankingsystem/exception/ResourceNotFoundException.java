package com.banfico.bankingsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * ResourceNotFoundException
 *
 * A custom exception we throw whenever a requested resource
 * (e.g. an account, a customer) does not exist in the database.
 *
 * @ResponseStatus(HttpStatus.NOT_FOUND) tells Spring Boot to
 * automatically return HTTP 404 when this exception is thrown.
 *
 * Why create custom exceptions instead of using generic ones?
 *   - More descriptive — the name tells you exactly what went wrong
 *   - Allows GlobalExceptionHandler to handle each type differently
 *   - Maps cleanly to HTTP status codes (404, 400, 409, etc.)
 *
 * Usage example in a service:
 *   Account account = accountRepository.findById(id)
 *       .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));
 *
 * That will respond with:
 *   HTTP 404 - "Account not found with id: 42"
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue));
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }

}
