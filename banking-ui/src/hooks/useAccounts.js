import { useState, useEffect, useCallback } from 'react';
import accountService from '../services/accountService';

/**
 * useAccounts — fetches all accounts or filtered by customerId
 *
 * customerId is optional:
 *   useAccounts()            → fetch all accounts (Account List page)
 *   useAccounts(customerId)  → fetch accounts for one customer (Customer Detail page)
 */
export function useAccounts(customerId) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = customerId
        ? await accountService.getByCustomerId(customerId)
        : await accountService.getAll();
      setAccounts(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return { accounts, loading, error, refetch: fetchAccounts };
}

/**
 * useAccount — fetches a single account by accountId
 */
export function useAccount(id) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await accountService.getById(id);
        if (!cancelled) setAccount(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [id]);

  return { account, loading, error };
}
