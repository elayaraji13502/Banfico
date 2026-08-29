import apiClient from './api';

/**
 * transactionService.js
 *
 * All API calls for the Transaction resource.
 * Transactions are always nested under an Account:
 *   /api/accounts/{accountId}/transactions
 *
 * This reflects the backend TransactionController which uses
 * @RequestMapping("/api/accounts/{accountId}/transactions")
 */

const transactionService = {

  /**
   * GET /api/accounts/{accountId}/transactions
   * Returns: TransactionResponseDTO[] (newest first)
   */
  getByAccountId: (accountId) =>
    apiClient.get(`/accounts/${accountId}/transactions`),

  /**
   * POST /api/accounts/{accountId}/transactions
   * Body: { amount, transactionType, description }
   * Returns: TransactionResponseDTO (201 Created)
   *
   * transactionType: CREDIT (deposit) | DEBIT (withdrawal)
   *
   * Business rules enforced by backend:
   *   - Account must be ACTIVE
   *   - DEBIT amount must not exceed current balance
   */
  post: (accountId, data) =>
    apiClient.post(`/accounts/${accountId}/transactions`, data),
};

export default transactionService;
