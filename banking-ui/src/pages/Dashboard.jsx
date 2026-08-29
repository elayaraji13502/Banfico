import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import customerService from '../services/customerService';
import accountService from '../services/accountService';
import beneficiaryService from '../services/beneficiaryService';
import transactionService from '../services/transactionService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';

/**
 * Dashboard Page
 *
 * The landing page of the application.
 * Fetches summary counts and the most recent accounts and transactions
 * to give the user an at-a-glance overview of the system.
 *
 * Multiple parallel API calls:
 *   Promise.allSettled([...]) fires all requests simultaneously instead
 *   of one-at-a-time. This is faster — total time = slowest single request,
 *   not the sum of all requests.
 *
 *   allSettled (vs Promise.all):
 *     Promise.all  → fails immediately if ANY request fails
 *     Promise.allSettled → waits for ALL to finish, reports each result
 *     We use allSettled so a failing stat doesn't break the whole dashboard.
 */
export default function Dashboard() {
  const [stats, setStats]             = useState({ customers: 0, accounts: 0, beneficiaries: 0 });
  const [recentAccounts, setRecentAccounts]         = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const [customersRes, accountsRes, beneficiariesRes] = await Promise.allSettled([
          customerService.getAll(),
          accountService.getAll(),
          beneficiaryService.getAll(),
        ]);

        const customers    = customersRes.status    === 'fulfilled' ? (customersRes.value    ?? []) : [];
        const accounts     = accountsRes.status     === 'fulfilled' ? (accountsRes.value     ?? []) : [];
        const beneficiaries = beneficiariesRes.status === 'fulfilled' ? (beneficiariesRes.value ?? []) : [];

        setStats({
          customers:    customers.length,
          accounts:     accounts.length,
          beneficiaries: beneficiaries.length,
        });

        // Show 5 most recent accounts (last in list = most recently created)
        setRecentAccounts([...accounts].reverse().slice(0, 5));

        // Fetch transactions for first account if available
        if (accounts.length > 0) {
          try {
            const txns = await transactionService.getByAccountId(accounts[0].accountId);
            setRecentTransactions((txns ?? []).slice(0, 5));
          } catch {
            // non-critical — dashboard still works without transactions
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div className="page-wrapper">

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome to Banfico Banking System</p>
        </div>
        <Link to="/customers/new" className="btn btn-primary">
          + New Customer
        </Link>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {/* ── Stat Cards ── */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{stats.customers}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: 'var(--secondary)' }}>
          <div className="stat-label">Total Accounts</div>
          <div className="stat-value" style={{ color: 'var(--secondary)' }}>
            {stats.accounts}
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: 'var(--success)' }}>
          <div className="stat-label">Beneficiaries</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {stats.beneficiaries}
          </div>
        </div>
      </div>

      {/* ── Two column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Recent Accounts */}
        <div className="card">
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Recent Accounts</span>
            <Link to="/accounts" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
              View all →
            </Link>
          </div>
          {recentAccounts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No accounts yet.{' '}
              <Link to="/customers/new">Create a customer</Link> to get started.
            </p>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Account No.</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAccounts.map((acc) => (
                    <tr key={acc.accountId}>
                      <td>
                        <Link to={`/accounts/${acc.accountId}`}>
                          {acc.accountNumber}
                        </Link>
                      </td>
                      <td><StatusBadge value={acc.accountType} /></td>
                      <td style={{ fontWeight: 600 }}>
                        ₹{Number(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td><StatusBadge value={acc.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Recent Transactions</span>
            {recentAccounts.length > 0 && (
              <Link
                to={`/accounts/${recentAccounts[0]?.accountId}/transactions`}
                style={{ fontSize: '0.8rem', fontWeight: 500 }}
              >
                View all →
              </Link>
            )}
          </div>
          {recentTransactions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No transactions yet.
            </p>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((txn) => (
                    <tr key={txn.transactionId}>
                      <td><StatusBadge value={txn.transactionType} /></td>
                      <td className={txn.transactionType === 'CREDIT' ? 'amount-credit' : 'amount-debit'}>
                        {txn.transactionType === 'CREDIT' ? '+' : '-'}
                        ₹{Number(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        ₹{Number(txn.balanceAfter).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ── Quick Links ── */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-title">Quick Actions</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/customers/new"    className="btn btn-primary">+ New Customer</Link>
          <Link to="/accounts"          className="btn btn-secondary">View Accounts</Link>
          <Link to="/beneficiaries/new" className="btn btn-secondary">+ Add Beneficiary</Link>
          <Link to="/customers"         className="btn btn-secondary">Customer List</Link>
        </div>
      </div>

    </div>
  );
}
