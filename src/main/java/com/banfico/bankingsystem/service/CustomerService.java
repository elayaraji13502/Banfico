package com.banfico.bankingsystem.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banfico.bankingsystem.dto.CustomerRequestDTO;
import com.banfico.bankingsystem.dto.CustomerResponseDTO;
import com.banfico.bankingsystem.entity.Customer;
import com.banfico.bankingsystem.exception.DuplicateResourceException;
import com.banfico.bankingsystem.exception.ResourceNotFoundException;
import com.banfico.bankingsystem.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * CustomerService
 *
 * Contains ALL business logic for customer operations.
 * The controller never touches the repository directly —
 * all database access goes through this service.
 *
 * @Transactional:
 *   Wraps the method in a database transaction.
 *   If anything fails mid-method, ALL database changes are rolled back.
 *   readOnly = true → tells Hibernate this is a read-only operation,
 *   which enables query optimisations (no dirty checking, etc.)
 *
 * Mapping pattern (Entity ↔ DTO):
 *   We manually map between Entity and DTO here.
 *   This keeps the service in full control of what data flows in/out.
 *   In larger projects, a library like MapStruct handles this automatically.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    // ---------------------------------------------------------------
    // CREATE
    // POST /api/customers
    // ---------------------------------------------------------------

    /**
     * Creates a new customer after validating uniqueness of email and phone.
     *
     * Flow:
     *   1. Check email not already in use → throw DuplicateResourceException if so
     *   2. Check phone not already in use → throw DuplicateResourceException if so
     *   3. Build Customer entity from DTO
     *   4. Save to database → Hibernate generates INSERT SQL
     *   5. Map saved entity back to DTO and return
     */
    @Transactional
    public CustomerResponseDTO createCustomer(CustomerRequestDTO dto) {
        log.debug("Creating customer with email: {}", dto.getEmail());

        if (customerRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Customer", "email", dto.getEmail());
        }
        if (customerRepository.existsByPhone(dto.getPhone())) {
            throw new DuplicateResourceException("Customer", "phone", dto.getPhone());
        }

        Customer customer = Customer.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .build();

        Customer saved = customerRepository.save(customer);
        log.info("Customer created with id: {}", saved.getId());
        return toResponseDTO(saved);
    }

    // ---------------------------------------------------------------
    // READ ALL
    // GET /api/customers
    // ---------------------------------------------------------------

    /**
     * Returns all customers as a list of DTOs.
     *
     * stream().map(this::toResponseDTO).collect(Collectors.toList())
     *   → takes the List<Customer> from the DB
     *   → maps each Customer entity to a CustomerResponseDTO
     *   → collects into a new List<CustomerResponseDTO>
     *
     * readOnly = true → Hibernate skips dirty-checking (faster for reads)
     */
    @Transactional(readOnly = true)
    public List<CustomerResponseDTO> getAllCustomers() {
        log.debug("Fetching all customers");
        return customerRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------
    // READ ONE
    // GET /api/customers/{id}
    // ---------------------------------------------------------------

    /**
     * Finds a customer by ID.
     *
     * findById() returns Optional<Customer>.
     * orElseThrow() → if the Optional is empty (not found),
     * throws ResourceNotFoundException which GlobalExceptionHandler
     * converts to HTTP 404.
     */
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerById(Long id) {
        log.debug("Fetching customer with id: {}", id);
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        return toResponseDTO(customer);
    }

    // ---------------------------------------------------------------
    // UPDATE
    // PUT /api/customers/{id}
    // ---------------------------------------------------------------

    /**
     * Updates an existing customer's details.
     *
     * existsByEmailAndIdNot(email, id):
     *   Checks if ANOTHER customer (not this one) already has this email.
     *   Without the "AndIdNot" part, a customer updating their own record
     *   would always fail the duplicate check.
     */
    @Transactional
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO dto) {
        log.debug("Updating customer with id: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        if (customerRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new DuplicateResourceException("Customer", "email", dto.getEmail());
        }
        if (customerRepository.existsByPhoneAndIdNot(dto.getPhone(), id)) {
            throw new DuplicateResourceException("Customer", "phone", dto.getPhone());
        }

        customer.setFullName(dto.getFullName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());

        Customer updated = customerRepository.save(customer);
        log.info("Customer updated with id: {}", updated.getId());
        return toResponseDTO(updated);
    }

    // ---------------------------------------------------------------
    // DELETE
    // DELETE /api/customers/{id}
    // ---------------------------------------------------------------

    /**
     * Deletes a customer by ID.
     *
     * We check existence first so we can throw a meaningful 404
     * rather than silently doing nothing if the ID doesn't exist.
     * CascadeType.ALL on Customer means related Accounts,
     * Transactions, and Beneficiaries are also deleted.
     */
    @Transactional
    public void deleteCustomer(Long id) {
        log.debug("Deleting customer with id: {}", id);
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer", "id", id);
        }
        customerRepository.deleteById(id);
        log.info("Customer deleted with id: {}", id);
    }

    // ---------------------------------------------------------------
    // PRIVATE HELPER — Entity → DTO mapping
    // ---------------------------------------------------------------

    /**
     * Maps a Customer entity to a CustomerResponseDTO.
     * Called internally whenever we need to return a customer to the client.
     */
    private CustomerResponseDTO toResponseDTO(Customer customer) {
        return CustomerResponseDTO.builder()
                .id(customer.getId())
                .fullName(customer.getFullName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .createdAt(customer.getCreatedAt())
                .build();
    }
}
