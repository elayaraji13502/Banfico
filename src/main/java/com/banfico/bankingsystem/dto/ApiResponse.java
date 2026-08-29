package com.banfico.bankingsystem.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;

/**
 * ApiResponse<T>
 *
 * A generic wrapper around every API response in this application.
 * Instead of returning raw data objects, every endpoint returns this
 * wrapper so the client always gets a consistent envelope.
 *
 * Why use a response wrapper?
 *   Without it, success and error responses look completely different.
 *   With it, every response — success or failure — follows the same shape:
 *
 *   SUCCESS:
 *   {
 *     "success": true,
 *     "message": "Customer created successfully",
 *     "data": { "id": 1, "fullName": "John Doe", ... },
 *     "timestamp": "2024-08-28T10:30:00"
 *   }
 *
 *   FAILURE (handled by GlobalExceptionHandler):
 *   {
 *     "success": false,
 *     "message": "Customer not found with id: 99",
 *     "data": null,
 *     "timestamp": "2024-08-28T10:30:05"
 *   }
 *
 * <T> is a generic type parameter — it means ApiResponse can wrap
 * ANY type: ApiResponse<CustomerResponseDTO>, ApiResponse<List<AccountResponseDTO>>, etc.
 *
 * @JsonInclude(NON_NULL) → Jackson skips fields that are null when
 *   serialising to JSON. So if "data" is null on an error response,
 *   it won't appear in the JSON at all — cleaner output.
 *
 * Static factory methods (of / success / error) are the standard
 * way to construct instances — no need to call new ApiResponse<>() directly.
 */
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    private final boolean success;
    private final String message;
    private final T data;
    private final String timestamp;

    // Private constructor — forces use of factory methods below
    private ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now().format(FORMATTER);
    }

    /**
     * Create a success response WITH data.
     * Used for: GET (return resource), POST (return created resource),
     *           PUT (return updated resource)
     *
     * Example: ApiResponse.success("Customer created successfully", customerDto)
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    /**
     * Create a success response WITHOUT data.
     * Used for: DELETE (nothing to return after deletion)
     *
     * Example: ApiResponse.success("Customer deleted successfully")
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }

    /**
     * Create an error response.
     * Used by GlobalExceptionHandler for all error cases.
     *
     * Example: ApiResponse.error("Customer not found with id: 99")
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
