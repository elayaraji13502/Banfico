package com.banfico.bankingsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banfico.bankingsystem.dto.InfoDTO;
import com.banfico.bankingsystem.service.InfoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * InfoController
 *
 * Handles the GET /api/info endpoint.
 *
 * @RequestMapping("/api") on the class means every method inside
 * this controller will be prefixed with /api.
 * So @GetMapping("/info") becomes → GET /api/info
 *
 * Clean Architecture — why does the controller call a service?
 * ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
 * │  Controller │ ───► │   Service   │ ───► │ Repository  │
 * │  (HTTP in)  │      │ (business   │      │  (database) │
 * │             │ ◄─── │   logic)    │ ◄─── │             │
 * └─────────────┘      └─────────────┘      └─────────────┘
 *
 * Controller = handles HTTP request/response only
 * Service    = contains all business logic
 * Repository = talks to the database
 *
 * This separation means:
 *   - You can test each layer independently
 *   - Changing the database doesn't affect the controller
 *   - Changing the API format doesn't affect business logic
 *
 * @RequiredArgsConstructor (Lombok):
 *   Generates a constructor for all "final" fields.
 *   Spring uses this constructor to inject the InfoService
 *   automatically (Constructor Injection — the recommended way).
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InfoController {

    // final + @RequiredArgsConstructor = Spring injects this automatically
    private final InfoService infoService;

    /**
     * GET /api/info
     *
     * Returns application metadata: name and version.
     * Values come from application.properties via InfoService.
     *
     * Response example:
     * {
     *   "appName": "Banfico Banking System",
     *   "version": "1.0.0"
     * }
     */
    @GetMapping("/info")
    public ResponseEntity<InfoDTO> getInfo() {
        log.debug("Info endpoint called");
        InfoDTO info = infoService.getInfo();
        return ResponseEntity.ok(info);
    }

}
