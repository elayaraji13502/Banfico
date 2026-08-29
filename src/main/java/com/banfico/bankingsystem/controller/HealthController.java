package com.banfico.bankingsystem.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

/**
 * HealthController
 *
 * Handles the GET /health endpoint.
 *
 * @RestController is a combination of two annotations:
 *   - @Controller  → marks this class as a Spring MVC controller
 *   - @ResponseBody → automatically converts return values to JSON
 *
 * So instead of returning an HTML page (like old Spring MVC),
 * every method here returns JSON directly.
 *
 * @Slf4j (from Lombok) gives us a free "log" variable so we can
 * write log.info(), log.debug(), log.error() without boilerplate.
 *
 * ResponseEntity<T>:
 *   A Spring wrapper that lets you control the full HTTP response:
 *   - The body (the JSON data)
 *   - The status code (200, 404, 500, etc.)
 *   - The headers (Content-Type, etc.)
 *
 *   ResponseEntity.ok(body) → sets status 200 OK + body
 */
@Slf4j
@RestController
public class HealthController {

    /**
     * GET /health
     *
     * A simple endpoint to verify the application is running.
     * Used by load balancers, monitoring tools, and developers
     * to check if the service is alive.
     *
     * Returns HTTP 200 with:
     * {
     *   "status": "UP",
     *   "message": "Banking API Running Successfully"
     * }
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        log.debug("Health check endpoint called");

        // LinkedHashMap preserves insertion order so JSON keys
        // always appear in the same order: status first, then message
        Map<String, String> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("message", "Banking API Running Successfully");

        return ResponseEntity.ok(response);
    }

}
