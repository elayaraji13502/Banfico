package com.banfico.bankingsystem.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Customer Entity
 *
 * @Entity   → Hibernate maps this class to the "customers" table in PostgreSQL.
 * @Table    → Explicitly names the table "customers".
 * @Id      → Marks the primary key field.
 * @GeneratedValue → Auto-increments the ID for every new customer.
 *
 * Relationships:
 *   One Customer → Many Accounts  (@OneToMany)
 *   One Customer → Many Beneficiaries (@OneToMany)
 *
 * CascadeType.ALL → Any operation on Customer (save/delete)
 *   cascades to its Accounts and Beneficiaries.
 *
 * FetchType.LAZY → Accounts and Beneficiaries are NOT loaded
 *   from DB until you actually access them. Prevents unnecessary
 *   SQL joins on every customer query.
 *
 * mappedBy = "customer" → The foreign key column lives in the
 *   Account table (account.customer_id), not in customers table.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone", nullable = false, unique = true)
    private String phone;

    @Column(name = "address")
    private String address;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // One customer can have multiple accounts
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Account> accounts = new ArrayList<>();

    // One customer can have multiple beneficiaries
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Beneficiary> beneficiaries = new ArrayList<>();
}
