package com.banfico.bankingsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banfico.bankingsystem.entity.Transaction;

/**
 * TransactionRepository
 *
 * Extends JpaRepository<Transaction, Long>
 *   - Transaction → the entity this repo manages
 *   - Long        → type of transactionId (primary key)
 *
 * Custom query methods:
 *
 *   findByAccount_AccountId(accountId)
 *     → fetches all transactions for a given account
 *     → "Account_AccountId" means: navigate to Transaction.account,
 *       then get .accountId
 *     → Hibernate generates:
 *         SELECT * FROM transactions WHERE account_id = ?
 *         ORDER is handled in the service layer
 *
 *   findByAccount_AccountIdOrderByTimestampDesc(accountId)
 *     → same as above but sorted newest-first
 *     → Spring Data JPA reads "OrderByTimestampDesc" from the method name
 *     → Generates: SELECT * FROM transactions WHERE account_id = ?
 *                  ORDER BY timestamp DESC
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccount_AccountId(Long accountId);

    List<Transaction> findByAccount_AccountIdOrderByTimestampDesc(Long accountId);
}
