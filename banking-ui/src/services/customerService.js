import apiClient from './api';

/**
 * customerService.js
 *
 * All API calls for the Customer resource.
 * Maps directly to CustomerController endpoints in Spring Boot.
 *
 * Every function returns a Promise. The caller (hook or component)
 * handles the resolved value and any errors.
 *
 * WHY A SERVICE LAYER?
 * ────────────────────
 * Without a service layer, every component imports axios and hardcodes
 * the URL. If the URL changes, you update it in 10 places.
 * With a service layer, the URL is in ONE place — here.
 * Components just call customerService.getAll() — no URLs, no axios.
 */

const customerService = {

  /**
   * GET /api/customers
   * Returns: CustomerResponseDTO[]
   */
  getAll: () => apiClient.get('/customers'),

  /**
   * GET /api/customers/{id}
   * Returns: CustomerResponseDTO
   */
  getById: (id) => apiClient.get(`/customers/${id}`),

  /**
   * POST /api/customers
   * Body: { fullName, email, phone, address }
   * Returns: CustomerResponseDTO (201 Created)
   */
  create: (data) => apiClient.post('/customers', data),

  /**
   * PUT /api/customers/{id}
   * Body: { fullName, email, phone, address }
   * Returns: CustomerResponseDTO (200 OK)
   */
  update: (id, data) => apiClient.put(`/customers/${id}`, data),

  /**
   * DELETE /api/customers/{id}
   * Returns: 204 No Content
   */
  remove: (id) => apiClient.delete(`/customers/${id}`),
};

export default customerService;
