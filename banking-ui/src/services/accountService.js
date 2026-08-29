import apiClient from './api';

/**
 * accountService.js
 *
 * All API calls for the Account resource.
 * Maps directly to AccountController endpoints in Spring Boot.
 */

const accountService = {

  /**
   * GET /api/accounts
   * Returns: AccountResponseDTO[]
   */
  getAll: () => apiClient.get('/accounts'),

  /**
   * GET /api/accounts?customerId={id}
   * Returns: AccountResponseDTO[] (filtered by customer)
   *
   * Axios params option → appends as query string automatically:
   *   { params: { customerId: 5 } } → GET /accounts?customerId=5
   */
  getByCustomerId: (customerId) =>
    apiClient.get('/accounts', { params: { customerId } }),

  /**
   * GET /api/accounts/{id}
   * Returns: AccountResponseDTO
   */
  getById: (id) => apiClient.get(`/accounts/${id}`),

  /**
   * POST /api/accounts
   * Body: { accountType, initialDeposit, customerId }
   * Returns: AccountResponseDTO (201 Created)
   *
   * Account types: SAVINGS | CURRENT | FIXED_DEPOSIT
   */
  create: (data) => apiClient.post('/accounts', data),
};

export default accountService;
