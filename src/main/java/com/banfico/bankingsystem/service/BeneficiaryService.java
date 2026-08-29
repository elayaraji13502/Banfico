package com.banfico.bankingsystem.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banfico.bankingsystem.dto.BeneficiaryRequestDTO;
import com.banfico.bankingsystem.dto.BeneficiaryResponseDTO;
import com.banfico.bankingsystem.entity.Beneficiary;
import com.banfico.bankingsystem.entity.Customer;
import com.banfico.bankingsystem.exception.DuplicateResourceException;
import com.banfico.bankingsystem.exception.ResourceNotFoundException;
import com.banfico.bankingsystem.repository.BeneficiaryRepository;
import com.banfico.bankingsystem.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * BeneficiaryService
 *
 * Business logic for managing saved payees (beneficiaries).
 *
 * Key business rule — duplicate prevention:
 *   A customer should not be able to save the same account number
 *   as a beneficiary twice. We check this before saving.
 *   existsByCustomer_IdAndAccountNumber(customerId, accountNumber)
 *   → returns true if this customer already has a beneficiary
 *     with that exact account number.
 *
 * GET /api/beneficiaries supports an optional ?customerId filter.
 *   Without filter → returns all beneficiaries (admin view)
 *   With filter    → returns only beneficiaries for that customer
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final CustomerRepository customerRepository;

    // ---------------------------------------------------------------
    // CREATE
    // POST /api/beneficiaries
    // ---------------------------------------------------------------

    /**
     * Saves a new beneficiary for a customer.
     *
     * Flow:
     *   1. Verify customer exists → 404 if not
     *   2. Check customer doesn't already have this account number saved → 409
     *   3. Build and save Beneficiary entity
     *   4. Return DTO
     */
    @Transactional
    public BeneficiaryResponseDTO createBeneficiary(BeneficiaryRequestDTO dto) {
        log.debug("Adding beneficiary for customerId: {}", dto.getCustomerId());

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", dto.getCustomerId()));

        if (beneficiaryRepository.existsByCustomer_IdAndAccountNumber(
                dto.getCustomerId(), dto.getAccountNumber())) {
            throw new DuplicateResourceException(
                    "Beneficiary with account number " + dto.getAccountNumber()
                    + " already exists for this customer");
        }

        Beneficiary beneficiary = Beneficiary.builder()
                .beneficiaryName(dto.getBeneficiaryName())
                .bankName(dto.getBankName())
                .accountNumber(dto.getAccountNumber())
                .customer(customer)
                .build();

        Beneficiary saved = beneficiaryRepository.save(beneficiary);
        log.info("Beneficiary created with id: {} for customerId: {}",
                saved.getBeneficiaryId(), dto.getCustomerId());
        return toResponseDTO(saved);
    }

    // ---------------------------------------------------------------
    // READ ALL (optionally filtered by customer)
    // GET /api/beneficiaries
    // GET /api/beneficiaries?customerId={id}
    // ---------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<BeneficiaryResponseDTO> getAllBeneficiaries() {
        log.debug("Fetching all beneficiaries");
        return beneficiaryRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BeneficiaryResponseDTO> getBeneficiariesByCustomerId(Long customerId) {
        log.debug("Fetching beneficiaries for customerId: {}", customerId);
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer", "id", customerId);
        }
        return beneficiaryRepository.findByCustomer_Id(customerId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------
    // DELETE
    // DELETE /api/beneficiaries/{id}
    // ---------------------------------------------------------------

    /**
     * Removes a saved beneficiary.
     * Verifies existence first to return a clean 404 rather than
     * silently doing nothing.
     */
    @Transactional
    public void deleteBeneficiary(Long beneficiaryId) {
        log.debug("Deleting beneficiary with id: {}", beneficiaryId);
        if (!beneficiaryRepository.existsById(beneficiaryId)) {
            throw new ResourceNotFoundException("Beneficiary", "id", beneficiaryId);
        }
        beneficiaryRepository.deleteById(beneficiaryId);
        log.info("Beneficiary deleted with id: {}", beneficiaryId);
    }

    // ---------------------------------------------------------------
    // HELPER — Entity → DTO mapping
    // ---------------------------------------------------------------
    private BeneficiaryResponseDTO toResponseDTO(Beneficiary b) {
        return BeneficiaryResponseDTO.builder()
                .beneficiaryId(b.getBeneficiaryId())
                .beneficiaryName(b.getBeneficiaryName())
                .bankName(b.getBankName())
                .accountNumber(b.getAccountNumber())
                .customerId(b.getCustomer().getId())
                .customerName(b.getCustomer().getFullName())
                .build();
    }
}
