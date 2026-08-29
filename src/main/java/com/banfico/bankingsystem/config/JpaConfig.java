package com.banfico.bankingsystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * JpaConfig
 *
 * This configuration class sets up JPA and transaction management
 * for the entire application.
 *
 * @Configuration
 *   Marks this as a Spring configuration class (like a settings file).
 *   Spring reads it at startup and applies the settings.
 *
 * @EnableJpaRepositories
 *   Tells Spring Data JPA where to look for Repository interfaces.
 *   Spring will automatically create implementations for all interfaces
 *   that extend JpaRepository<Entity, ID> in the given package.
 *   You write the interface — Spring writes the SQL for you.
 *
 * @EnableTransactionManagement
 *   Enables Spring's annotation-driven transaction management.
 *   This allows you to use @Transactional on service methods to
 *   wrap database operations in a transaction — if anything fails,
 *   all changes are rolled back automatically.
 *
 * How PostgreSQL connects at startup:
 *   1. Spring reads datasource.url/username/password from application.properties
 *   2. Creates a HikariCP connection pool (fast, industry-standard)
 *   3. Hibernate validates/creates tables based on your @Entity classes
 *   4. Spring Data JPA creates repository implementations automatically
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.banfico.bankingsystem.repository")
@EnableTransactionManagement
public class JpaConfig {
    // Spring Boot auto-configures the DataSource and EntityManagerFactory
    // from application.properties — no extra beans needed here for basic setup.
    // This class exists to make the JPA configuration explicit and extensible.
}
