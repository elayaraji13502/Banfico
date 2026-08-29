package com.banfico.bankingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * InfoDTO (Data Transfer Object)
 *
 * A DTO is a simple object used to carry data between layers.
 * It is NOT stored in the database — it only travels over HTTP as JSON.
 *
 * Why use a DTO instead of returning raw strings?
 *   - Gives the response a clear, consistent JSON structure
 *   - Lets you add/remove fields without breaking other layers
 *   - Industry standard for clean API design
 *
 * Lombok annotations used here:
 *   @Data           → auto-generates getters, setters, toString, equals, hashCode
 *   @Builder        → lets you build the object like: InfoDTO.builder().name("x").build()
 *   @NoArgsConstructor  → generates an empty constructor (needed by JSON libraries)
 *   @AllArgsConstructor → generates a constructor with all fields
 *
 * The JSON response for GET /api/info will look like:
 * {
 *   "appName": "Banfico Banking System",
 *   "version": "1.0.0"
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InfoDTO {

    private String appName;
    private String version;

}
