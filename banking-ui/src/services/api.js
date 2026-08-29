import axios from 'axios';

/**
 * api.js — Axios Base Client
 *
 * WHAT IS AXIOS?
 * ──────────────
 * Axios is a promise-based HTTP client for JavaScript.
 * It is the standard choice for making API calls from React.
 *
 * FETCH vs AXIOS:
 * ───────────────
 * Feature                  fetch()          Axios
 * ─────────────────────────────────────────────────
 * Built into browser       ✅ Yes           ❌ No (npm install)
 * Auto JSON parse          ❌ Manual        ✅ Automatic
 * Request interceptors     ❌ No            ✅ Yes
 * Response interceptors    ❌ No            ✅ Yes
 * Error on 4xx/5xx         ❌ No (!)        ✅ Yes (throws)
 * Request cancellation     Verbose          Simple
 * Base URL config          ❌ Manual        ✅ baseURL option
 * Default headers          ❌ Manual        ✅ defaults
 *
 * Key difference: fetch() does NOT throw for 404 or 500 — you
 * must manually check response.ok. Axios throws automatically,
 * so your catch() blocks actually catch API errors.
 *
 * HOW AXIOS INTERCEPTORS WORK:
 * ────────────────────────────
 * Interceptors run before every request leaves or after every
 * response arrives. Perfect for:
 *   - Adding Authorization headers globally
 *   - Extracting response.data from every response automatically
 *   - Normalising error messages from the API
 *
 * JSON REQUEST/RESPONSE FLOW:
 * ───────────────────────────
 * React (Axios) ──POST /api/customers──► Spring Boot
 *   { "fullName": "John" }               Controller
 *       ▲                                    │ @RequestBody
 *       │                                    ▼
 *   response.data                        Service
 *   { success, message, data }               │
 *       ◄── JSON ───────────────────── ResponseEntity
 */

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds — fail fast if backend is unreachable
});

// ── Response Interceptor ──────────────────────────────────────────
// Our Spring Boot API wraps every response in ApiResponse<T>:
//   { success: true, message: "...", data: {...}, timestamp: "..." }
//
// This interceptor automatically unwraps .data from the Axios
// response AND from our ApiResponse envelope, so every service
// function receives the actual payload directly.
apiClient.interceptors.response.use(
  (response) => {
    // response.data = the full ApiResponse object from Spring Boot
    // response.data.data = the actual payload (CustomerResponseDTO, etc.)
    const apiResponse = response.data;

    // For DELETE (204 No Content) there is no body — return as-is
    if (!apiResponse) return apiResponse;

    // If Spring Boot returned success: true, unwrap the data field
    if (apiResponse.success === true) return apiResponse.data;

    // If success: false, reject so catch() blocks catch it
    return Promise.reject(new Error(apiResponse.message || 'Request failed'));
  },
  (error) => {
    // Network error (backend not running, timeout, etc.)
    if (!error.response) {
      return Promise.reject(
        new Error('Cannot reach the server. Make sure the backend is running on port 8080.')
      );
    }

    // API returned an error response (4xx, 5xx)
    // Our GlobalExceptionHandler returns ApiResponse.error(message)
    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      `Request failed with status ${error.response.status}`;

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
