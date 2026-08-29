package com.banfico.bankingsystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.banfico.bankingsystem.dto.ApiResponse;
import com.banfico.bankingsystem.dto.BeneficiaryRequestDTO;
import com.banfico.bankingsystem.dto.BeneficiaryResponseDTO;
import com.banfico.bankingsystem.service.BeneficiaryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * BeneficiaryController
 *
 * Handles all HTTP requests for Beneficiary resources.
 *
 * Endpoints:
 *   POST   /api/beneficiaries              → save a new beneficiary
 *   GET    /api/beneficiaries              → get all beneficiaries
 *   GET    /api/beneficiaries?customerId=5 → get beneficiaries for a customer
 *   DELETE /api/beneficiaries/{id}         → remove a saved beneficiary
 */
@Slf4j
@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    /**
     * POST /api/beneficiaries
     * Save a new beneficiary for a customer.
     * Returns 201 Created with the saved beneficiary details.
     * Returns 404 if customer not found, 409 if duplicate account number.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<BeneficiaryResponseDTO>> createBeneficiary(
            @Valid @RequestBody BeneficiaryRequestDTO request) {

        BeneficiaryResponseDTO created = beneficiaryService.createBeneficiary(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Beneficiary added successfully", created));
    }

    /**
     * GET /api/beneficiaries
     * GET /api/beneficiaries?customerId={id}
     *
     * Without customerId → all beneficiaries in the system.
     * With customerId    → beneficiaries belonging to that customer only.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<BeneficiaryResponseDTO>>> getBeneficiaries(
            @RequestParam(required = false) Long customerId) {

        List<BeneficiaryResponseDTO> beneficiaries = (customerId != null)
                ? beneficiaryService.getBeneficiariesByCustomerId(customerId)
                : beneficiaryService.getAllBeneficiaries();

        return ResponseEntity.ok(
                ApiResponse.success("Beneficiaries retrieved successfully", beneficiaries));
    }

    /**
     * DELETE /api/beneficiaries/{id}
     * Remove a saved beneficiary.
     * Returns 204 No Content on success.
     * Returns 404 if beneficiary not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBeneficiary(@PathVariable Long id) {
        beneficiaryService.deleteBeneficiary(id);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
