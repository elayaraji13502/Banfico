package com.banfico.bankingsystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CorsConfig — Cross-Origin Resource Sharing
 *
 * WHY THIS IS NEEDED:
 * ──────────────────
 * Browsers enforce the Same-Origin Policy:
 *   "A web page can only make requests to the SAME origin it was loaded from."
 *
 * Your React app runs at:  http://localhost:5173  (Vite dev server)
 * Your Spring Boot runs at: http://localhost:8080
 *
 * These are DIFFERENT origins (different port = different origin).
 * Without CORS config, the browser blocks every Axios request
 * from the React app to Spring Boot with:
 *   "Access to XMLHttpRequest has been blocked by CORS policy"
 *
 * HOW CORS WORKS:
 * ──────────────
 * 1. Browser sends a "preflight" OPTIONS request to the backend first
 * 2. Backend responds with headers saying which origins are allowed
 * 3. If the origin matches, the browser allows the actual request
 *
 * CorsFilter intercepts ALL incoming requests before they
 * reach any controller and adds the correct CORS headers.
 *
 * In PRODUCTION:
 *   Replace "http://localhost:5173" with your actual deployed frontend URL.
 *   Never use allowedOrigins("*") in production — it allows any website
 *   to make requests to your banking API.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow requests from the React Vite dev server
        config.addAllowedOrigin("http://localhost:5173");

        // Allow all standard HTTP methods
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS"); // required for preflight

        // Allow all headers (Content-Type, Authorization, etc.)
        config.addAllowedHeader("*");

        // Allow cookies and auth headers to be sent
        config.setAllowCredentials(true);

        // Apply this CORS config to ALL endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
