import { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactionService';

/**
 * useTransactions — fetches all transactions for a given accountId
 *
 * Re-fetches whenever accountId changes (navigating to a different account).
 * `refetch` is exposed so the Transaction History page can refresh
 * the list immediately after posting a new transaction.
 */
export function useTransactions(accountId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!accountId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getByAccountId(accountId);
      setTransactions(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, error, refetch: fetchTransactions };
}
