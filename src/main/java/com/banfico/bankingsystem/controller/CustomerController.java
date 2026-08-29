package com.banfico.bankingsystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banfico.bankingsystem.dto.ApiResponse;
import com.banfico.bankingsystem.dto.CustomerRequestDTO;
import com.banfico.bankingsystem.dto.CustomerResponseDTO;
import com.banfico.bankingsystem.service.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * CustomerController
 *
 * Handles all HTTP requests for Customer resources.
 * Delegates ALL logic to CustomerService — no business logic here.
 *
 * @RequestMapping("/api/customers") → all routes in this class
 *   are prefixed with /api/customers.
 *
 * @Valid → triggers Bean Validation on the request body DTO.
 *   If any @NotBlank, @Email, @Pattern checks fail,
 *   Spring throws MethodArgumentNotValidException BEFORE the
 *   method body runs. GlobalExceptionHandler catches it → 400.
 *
 * @PathVariable → extracts the {id} segment from the URL.
 *   GET /api/customers/5 → id = 5L
 *
 * @RequestBody → deserialises the JSON request body into the DTO.
 *   Jackson reads the JSON and fills in the DTO fields automatically.
 *
 * HTTP Status codes used:
 *   201 Created  → POST (resource successfully created)
 *   200 OK       → GET, PUT
 *   204 No Content → DELETE (success but nothing to return)
 */
@Slf4j
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /**
     * POST /api/customers
     * Create a new customer.
     * Returns 201 Created with the new customer in the response body.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> createCustomer(
            @Valid @RequestBody CustomerRequestDTO request) {

        CustomerResponseDTO created = customerService.createCustomer(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer created successfully", created));
    }

    /**
     * GET /api/customers
     * Retrieve all customers.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerResponseDTO>>> getAllCustomers() {
        List<CustomerResponseDTO> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(
                ApiResponse.success("Customers retrieved successfully", customers));
    }

    /**
     * GET /api/customers/{id}
     * Retrieve a single customer by ID.
     * Returns 404 if not found (handled by GlobalExceptionHandler).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> getCustomerById(
            @PathVariable Long id) {

        CustomerResponseDTO customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Customer retrieved successfully", customer));
    }

    /**
     * PUT /api/customers/{id}
     * Update an existing customer's details.
     * Returns 404 if not found, 409 if email/phone conflicts.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequestDTO request) {

        CustomerResponseDTO updated = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Customer updated successfully", updated));
    }

    /**
     * DELETE /api/customers/{id}
     * Delete a customer and all their associated accounts,
     * transactions, and beneficiaries (CascadeType.ALL).
     * Returns 204 No Content on success.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
