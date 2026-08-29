import { Link, useParams } from 'react-router-dom';
import { useAccount } from '../hooks/useAccounts';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';

/**
 * AccountDetail Page
 * Route: /accounts/:id
 *
 * Shows full account information and provides a link to
 * the transaction history for that account.
 */
export default function AccountDetail() {
  const { id }  = useParams();
  const accountId = parseInt(id, 10);
  const { account, loading, error } = useAccount(accountId);

  if (loading) return <Loader message="Loading account..." />;
  if (error)   return (
    <div className="page-wrapper">
      <Link to="/accounts" className="back-link">← Back to Accounts</Link>
      <ErrorMessage message={error} />
    </div>
  );
  if (!account) return null;

  return (
    <div className="page-wrapper">

      <Link to="/accounts" className="back-link">← Back to Accounts</Link>

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ fontFamily: 'monospace' }}>
            {account.accountNumber}
          </h1>
          <p className="page-subtitle">Account ID: {account.accountId}</p>
        </div>
        <Link
          to={`/accounts/${account.accountId}/transactions`}
          className="btn btn-primary"
        >
          View Transactions
        </Link>
      </div>

      {/* ── Account Info ── */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">Account Information</div>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">Account Number</div>
            <div className="detail-value" style={{ fontFamily: 'monospace' }}>
              {account.accountNumber}
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Account Type</div>
            <div className="detail-value">
              <StatusBadge value={account.accountType} />
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Current Balance</div>
            <div className="detail-value" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
              ₹{Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <StatusBadge value={account.status} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Account Owner ── */}
      {account.customer && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title">Account Owner</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Name</div>
              <div className="detail-value">
                <Link to={`/customers/${account.customer.id}`} style={{ fontWeight: 600 }}>
                  {account.customer.fullName}
                </Link>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Email</div>
              <div className="detail-value">{account.customer.email}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Customer ID</div>
              <div className="detail-value">#{account.customer.id}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="card">
        <div className="card-title">Actions</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to={`/accounts/${account.accountId}/transactions`}
            className="btn btn-primary"
          >
            Transaction History
          </Link>
          {account.customer && (
            <Link to={`/customers/${account.customer.id}`} className="btn btn-secondary">
              View Customer Profile
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}
