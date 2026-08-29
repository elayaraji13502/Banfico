import { useState, useEffect, useCallback } from 'react';
import customerService from '../services/customerService';

/**
 * useCustomers — Custom Hook
 *
 * WHAT IS A CUSTOM HOOK?
 * ──────────────────────
 * A custom hook is a JavaScript function whose name starts with "use"
 * and that calls built-in React hooks (useState, useEffect, etc.).
 *
 * Why create custom hooks instead of putting logic directly in components?
 *   - Separation of concerns: the component handles rendering,
 *     the hook handles data fetching and state management.
 *   - Reusability: any page that needs customer data imports this hook.
 *   - Testability: hooks can be tested independently.
 *
 * WHAT IS useState?
 * ──────────────────
 * useState is a React hook that adds state to a functional component.
 *
 *   const [value, setValue] = useState(initialValue);
 *
 *   value    → the current state value (read-only)
 *   setValue → the function to update the state
 *
 * When setValue is called, React re-renders the component with the new value.
 * Without useState, variables would reset to their initial value on every render.
 *
 * WHAT IS useEffect?
 * ───────────────────
 * useEffect runs AFTER the component renders. It is used for:
 *   - Fetching data from an API
 *   - Setting up subscriptions or timers
 *   - Any "side effect" that happens outside of rendering
 *
 *   useEffect(() => {
 *     // this runs after render
 *   }, [dependency]);
 *
 *   dependency array:
 *     []       → runs once after the first render (like componentDidMount)
 *     [value]  → runs when "value" changes
 *     (none)   → runs after every render (usually a bug — avoid)
 *
 * WHAT IS useCallback?
 * ─────────────────────
 * useCallback memoises a function so it is not recreated on every render.
 * We use it here so that `fetchCustomers` has a stable identity and can
 * safely be included in useEffect dependency arrays without infinite loops.
 */
export function useCustomers() {
  const [customers, setCustomers]   = useState([]);   // list of customers
  const [loading, setLoading]       = useState(true); // true while API call is in-flight
  const [error, setError]           = useState(null); // error string if API fails

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getAll();
      // data is already the unwrapped array thanks to our Axios interceptor
      setCustomers(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      // finally runs whether the call succeeded or failed
      setLoading(false);
    }
  }, []);

  // Fetch customers once when the component that uses this hook first mounts
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { customers, loading, error, refetch: fetchCustomers };
}

/**
 * useCustomer — fetches a single customer by ID
 *
 * The ID comes from the URL (e.g. /customers/5) via useParams() in the page.
 * We re-fetch whenever the ID changes (user navigates to a different customer).
 */
export function useCustomer(id) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false; // cleanup flag — prevents setState on unmounted component

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await customerService.getById(id);
        if (!cancelled) setCustomer(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    // Cleanup: if the component unmounts before the request finishes,
    // set cancelled = true so we don't update state on a dead component
    return () => { cancelled = true; };
  }, [id]);

  return { customer, loading, error };
}
