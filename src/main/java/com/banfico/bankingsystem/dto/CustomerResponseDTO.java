package com.banfico.bankingsystem.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CustomerResponseDTO
 *
 * Returned by GET /api/customers, GET /api/customers/{id},
 * POST /api/customers, PUT /api/customers/{id}
 *
 * Why a separate Response DTO?
 *   - You control exactly what data goes out to the client.
 *   - Never accidentally expose sensitive fields (passwords,
 *     internal flags, etc.).
 *   - Decouples your API contract from your database schema —
 *     you can rename a DB column without changing the API.
 *
 * We do NOT include the full accounts/beneficiaries lists here
 * to keep responses lightweight. Clients can call
 * GET /api/accounts?customerId={id} when they need that data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponseDTO {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private LocalDateTime createdAt;
}
