import apiClient from './api';

/**
 * beneficiaryService.js
 *
 * All API calls for the Beneficiary resource.
 * Maps directly to BeneficiaryController endpoints in Spring Boot.
 */

const beneficiaryService = {

  /**
   * GET /api/beneficiaries
   * Returns: BeneficiaryResponseDTO[]
   */
  getAll: () => apiClient.get('/beneficiaries'),

  /**
   * GET /api/beneficiaries?customerId={id}
   * Returns: BeneficiaryResponseDTO[] (filtered by customer)
   */
  getByCustomerId: (customerId) =>
    apiClient.get('/beneficiaries', { params: { customerId } }),

  /**
   * POST /api/beneficiaries
   * Body: { beneficiaryName, bankName, accountNumber, customerId }
   * Returns: BeneficiaryResponseDTO (201 Created)
   *
   * Business rules enforced by backend:
   *   - Customer must exist
   *   - Same accountNumber cannot be added twice for the same customer
   */
  create: (data) => apiClient.post('/beneficiaries', data),

  /**
   * DELETE /api/beneficiaries/{id}
   * Returns: 204 No Content
   */
  remove: (id) => apiClient.delete(`/beneficiaries/${id}`),
};

export default beneficiaryService;
