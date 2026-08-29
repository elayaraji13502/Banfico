package com.banfico.bankingsystem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.banfico.bankingsystem.dto.InfoDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * InfoService
 *
 * The service layer contains all BUSINESS LOGIC.
 * It sits between the Controller (HTTP) and the Repository (database).
 *
 * @Service tells Spring this is a service bean.
 * Spring creates one instance (singleton) and manages it.
 * When InfoController declares "private final InfoService infoService",
 * Spring injects this singleton automatically.
 *
 * @Value("${property.key}")
 *   Reads a value from application.properties and injects it
 *   directly into this field at startup.
 *
 *   Example:
 *     application.properties → spring.application.name=Banfico Banking System
 *     @Value("${spring.application.name}") → appName = "Banfico Banking System"
 *
 * Why read config in the Service, not the Controller?
 *   - Controllers should only handle HTTP concerns (request/response)
 *   - Business logic and data assembly belong in the service
 *   - Makes it easy to unit test the service independently
 *
 * How data flows for GET /api/info:
 *   1. HTTP request hits InfoController.getInfo()
 *   2. Controller calls infoService.getInfo()
 *   3. Service reads @Value fields, builds InfoDTO
 *   4. Controller wraps it in ResponseEntity.ok() → HTTP 200 + JSON
 */
@Slf4j
@Service
public class InfoService {

    // @Value injects values directly from application.properties
    @Value("${spring.application.name}")
    private String appName;

    @Value("${application.version}")
    private String version;

    /**
     * Builds and returns application metadata as an InfoDTO.
     *
     * Uses Lombok's @Builder pattern:
     *   InfoDTO.builder()
     *       .appName("Banfico Banking System")
     *       .version("1.0.0")
     *       .build()
     *
     * This is cleaner than calling new InfoDTO(appName, version)
     * because it's self-documenting — you can see exactly which
     * field gets which value.
     */
    public InfoDTO getInfo() {
        log.debug("Building application info response: name={}, version={}", appName, version);

        return InfoDTO.builder()
                .appName(appName)
                .version(version)
                .build();
    }

}
