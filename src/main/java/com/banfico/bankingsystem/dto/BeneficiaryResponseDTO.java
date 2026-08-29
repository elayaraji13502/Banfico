package com.banfico.bankingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * BeneficiaryResponseDTO
 *
 * Returned by POST /api/beneficiaries and GET /api/beneficiaries
 *
 * Includes the owning customer's id and name as a summary —
 * enough context without returning the full Customer object.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryResponseDTO {

    private Long beneficiaryId;
    private String beneficiaryName;
    private String bankName;
    private String accountNumber;

    // Owner summary
    private Long customerId;
    private String customerName;
}
