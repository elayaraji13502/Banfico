package com.banfico.bankingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.extern.slf4j.Slf4j;

/**
 * BankingSystemApplication
 *
 * This is the entry point of the entire Spring Boot application.
 *
 * @SpringBootApplication is a shortcut annotation that combines:
 *   - @Configuration        → marks this class as a source of bean definitions
 *   - @EnableAutoConfiguration → tells Spring Boot to auto-configure beans based on classpath
 *   - @ComponentScan        → scans all classes in this package and sub-packages
 *
 * When you run main(), Spring Boot:
 *   1. Reads application.properties
 *   2. Sets up an embedded Tomcat server on port 8080
 *   3. Connects to PostgreSQL using the datasource config
 *   4. Registers all @RestController, @Service, @Repository beans
 *   5. Makes the application ready to handle HTTP requests
 */
@SpringBootApplication
public class BankingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankingSystemApplication.class, args);
    }

}
