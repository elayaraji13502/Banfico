import { useState, useEffect, useCallback } from 'react';
import beneficiaryService from '../services/beneficiaryService';

/**
 * useBeneficiaries — fetches beneficiaries (all or by customerId)
 *
 * customerId is optional:
 *   useBeneficiaries()             → all beneficiaries (Beneficiary List page)
 *   useBeneficiaries(customerId)   → for one customer (Customer Detail page)
 */
export function useBeneficiaries(customerId) {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const fetchBeneficiaries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = customerId
        ? await beneficiaryService.getByCustomerId(customerId)
        : await beneficiaryService.getAll();
      setBeneficiaries(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  return { beneficiaries, loading, error, refetch: fetchBeneficiaries };
}
