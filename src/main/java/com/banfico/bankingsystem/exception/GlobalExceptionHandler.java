package com.banfico.bankingsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.banfico.bankingsystem.dto.ApiResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * GlobalExceptionHandler
 *
 * Intercepts ALL exceptions thrown anywhere in the application
 * and converts them into clean, consistent ApiResponse<Void> JSON.
 *
 * Every error response now uses ApiResponse.error(message) so the
 * client always gets the same envelope shape as success responses.
 *
 * Handler priority (Spring picks the most specific match):
 *   ResourceNotFoundException   → 404 Not Found
 *   DuplicateResourceException  → 409 Conflict
 *   InsufficientFundsException  → 422 Unprocessable Entity
 *   BadRequestException         → 400 Bad Request
 *   MethodArgumentNotValidException → 400 (validation failures)
 *   Exception (catch-all)       → 500 Internal Server Error
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ---------------------------------------------------------------
    // 404 NOT FOUND
    // ---------------------------------------------------------------
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    // ---------------------------------------------------------------
    // 409 CONFLICT — duplicate email, phone, account number, etc.
    // ---------------------------------------------------------------
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResource(DuplicateResourceException ex) {
        log.warn("Duplicate resource: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage()));
    }

    // ---------------------------------------------------------------
    // 422 UNPROCESSABLE ENTITY — debit exceeds balance
    // ---------------------------------------------------------------
    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<ApiResponse<Void>> handleInsufficientFunds(InsufficientFundsException ex) {
        log.warn("Insufficient funds: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiResponse.error(ex.getMessage()));
    }

    // ---------------------------------------------------------------
    // 400 BAD REQUEST — business rule violations
    // ---------------------------------------------------------------
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(BadRequestException ex) {
        log.warn("Bad request: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    // ---------------------------------------------------------------
    // 400 VALIDATION — @Valid failures on request DTOs
    // Collects all field errors into a single readable message.
    // ---------------------------------------------------------------
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("Validation failed");

        log.warn("Validation error: {}", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(message));
    }

    // ---------------------------------------------------------------
    // 500 INTERNAL SERVER ERROR — catch-all for unexpected failures
    // Never expose internal details to the client.
    // ---------------------------------------------------------------
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleAll(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred. Please try again later."));
    }
}
