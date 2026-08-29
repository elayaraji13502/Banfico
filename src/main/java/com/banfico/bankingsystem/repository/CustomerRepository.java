package com.banfico.bankingsystem.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banfico.bankingsystem.entity.Customer;

/**
 * CustomerRepository
 *
 * Extends JpaRepository<Customer, Long>
 *   - Customer → the entity this repo manages
 *   - Long     → the type of the primary key (id)
 *
 * JpaRepository gives you these methods for FREE — no SQL needed:
 *   save(entity)           → INSERT or UPDATE
 *   findById(id)           → SELECT WHERE id = ?  → returns Optional<Customer>
 *   findAll()              → SELECT * FROM customers
 *   deleteById(id)         → DELETE WHERE id = ?
 *   existsById(id)         → SELECT COUNT(*) WHERE id = ?
 *   count()                → SELECT COUNT(*) FROM customers
 *
 * Custom query methods — Spring Data JPA generates SQL from the method name:
 *   findByEmail("a@b.com") → SELECT * FROM customers WHERE email = 'a@b.com'
 *   existsByEmail(...)     → SELECT COUNT(*) WHERE email = ?  → boolean
 *   existsByPhone(...)     → SELECT COUNT(*) WHERE phone = ?  → boolean
 *
 * Optional<T> forces the caller to handle the "not found" case
 * instead of returning null (which causes NullPointerExceptions).
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    // Used during updates to check if another customer already has this email
    boolean existsByEmailAndIdNot(String email, Long id);

    // Used during updates to check if another customer already has this phone
    boolean existsByPhoneAndIdNot(String phone, Long id);
}
