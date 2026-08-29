package com.banfico.bankingsystem.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banfico.bankingsystem.entity.Account;

/**
 * AccountRepository
 *
 * Extends JpaRepository<Account, Long>
 *   - Account → the entity this repo manages
 *   - Long    → type of accountId (primary key)
 *
 * Custom query methods:
 *
 *   findByCustomer_Id(customerId)
 *     → finds all accounts belonging to a specific customer
 *     → "Customer_Id" means: navigate to Account.customer, then get .id
 *     → Hibernate generates: SELECT * FROM accounts WHERE customer_id = ?
 *
 *   findByAccountNumber(number)
 *     → used to check if an account number already exists before creating
 *
 *   existsByAccountNumber(number)
 *     → boolean check for uniqueness during account number generation
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByCustomer_Id(Long customerId);

    Optional<Account> findByAccountNumber(String accountNumber);

    boolean existsByAccountNumber(String accountNumber);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.accountId = :id")
    Optional<Account> findByIdForUpdate(@Param("id") Long id);
}
