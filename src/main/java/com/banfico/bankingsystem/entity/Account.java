package com.banfico.bankingsystem.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Account Entity
 *
 * Relationships:
 *   Many Accounts → One Customer  (@ManyToOne)
 *   One Account   → Many Transactions (@OneToMany)
 *
 * @ManyToOne with @JoinColumn → creates a foreign key column
 *   "customer_id" in the accounts table pointing to customers.id
 *
 * BigDecimal for balance → always use BigDecimal for money.
 *   double/float have rounding errors. BigDecimal is exact.
 *   e.g. double: 0.1 + 0.2 = 0.30000000000000004 ❌
 *        BigDecimal: 0.1 + 0.2 = 0.3 ✅
 *
 * @Enumerated(EnumType.STRING) → stores "SAVINGS" or "CURRENT"
 *   as text in the DB, not as a number (0, 1).
 *   String is safer — if you reorder the enum, the data is still correct.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "account_number", nullable = false, unique = true, length = 20)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;

    // BigDecimal with precision=15, scale=2 supports up to 9,999,999,999,999.99
    @Column(name = "balance", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private AccountStatus status = AccountStatus.ACTIVE;

    // Many accounts belong to one customer
    // @JoinColumn creates the foreign key "customer_id" in this table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // One account has many transactions
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Transaction> transactions = new ArrayList<>();

    // ---- Enums defined as inner types for cohesion ----

    public enum AccountType {
        SAVINGS, CURRENT, FIXED_DEPOSIT
    }

    public enum AccountStatus {
        ACTIVE, INACTIVE, SUSPENDED, CLOSED
    }
}
