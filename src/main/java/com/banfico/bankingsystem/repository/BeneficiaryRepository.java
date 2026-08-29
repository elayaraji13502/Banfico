package com.banfico.bankingsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banfico.bankingsystem.entity.Beneficiary;

/**
 * BeneficiaryRepository
 *
 * Extends JpaRepository<Beneficiary, Long>
 *   - Beneficiary → the entity this repo manages
 *   - Long        → type of beneficiaryId (primary key)
 *
 * Custom query methods:
 *
 *   findByCustomer_Id(customerId)
 *     → fetches all beneficiaries saved by a specific customer
 *     → Hibernate generates: SELECT * FROM beneficiaries WHERE customer_id = ?
 *
 *   existsByCustomer_IdAndAccountNumber(customerId, accountNumber)
 *     → prevents duplicate beneficiaries for the same customer
 *     → a customer should not be able to add the same account number twice
 */
@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByCustomer_Id(Long customerId);

    boolean existsByCustomer_IdAndAccountNumber(Long customerId, String accountNumber);
}
