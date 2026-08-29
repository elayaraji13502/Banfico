import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useAccount } from '../hooks/useAccounts';
import transactionService from '../services/transactionService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';

/**
 * TransactionHistory Page
 * Route: /accounts/:id/transactions
 *
 * Shows all transactions for a specific account and provides
 * an inline form to post a new CREDIT or DEBIT.
 *
 * After a successful transaction POST:
 *   1. refetch() re-runs GET /api/accounts/{id}/transactions
 *   2. The table updates automatically — no page reload
 *
 * Balance is read from the account object (useAccount hook),
 * updated via window.location.reload() after a transaction
 * so the displayed balance stays accurate.
 */
export default function TransactionHistory() {
  const { id } = useParams();
  const accountId = parseInt(id, 10);

  const { transactions, loading, error, refetch } = useTransactions(accountId);
  const { account, loading: accLoading, refetch: refetchAccount } = useAccount(accountId);

  // Transaction form
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState({ amount: '', transactionType: 'CREDIT', description: '' });
  const [formErrors, setFormErrors]   = useState({});
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.amount || Number(form.amount) <= 0)
      errs.amount = 'Amount must be greater than zero';
    if (!form.transactionType)
      errs.transactionType = 'Transaction type is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      await transactionService.post(accountId, {
        amount:          parseFloat(form.amount),
        transactionType: form.transactionType,
        description:     form.description || undefined,
      });
      setSubmitSuccess(
        `${form.transactionType === 'CREDIT' ? 'Deposit' : 'Withdrawal'} of ₹${parseFloat(form.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} posted successfully.`
      );
      setForm({ amount: '', transactionType: 'CREDIT', description: '' });
      refetch();             // refresh transaction list
      refetchAccount();      // refresh account balance
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || accLoading) return <Loader message="Loading transactions..." />;

  return (
    <div className="page-wrapper">

      <Link to={`/accounts/${accountId}`} className="back-link">
        ← Back to Account
      </Link>

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transaction History</h1>
          <p className="page-subtitle" style={{ fontFamily: 'monospace' }}>
            {account?.accountNumber}
            {account && (
              <span style={{ fontFamily: 'sans-serif', marginLeft: '12px' }}>
                Balance:{' '}
                <strong style={{ color: 'var(--primary)' }}>
                  ₹{Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </strong>
              </span>
            )}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm((v) => !v); setSubmitError(null); setSubmitSuccess(null); }}>
          {showForm ? '✕ Cancel' : '+ New Transaction'}
        </button>
      </div>

      {/* ── Transaction Form ── */}
      {showForm && (
        <div className="form-card" style={{ marginBottom: '24px', maxWidth: '480px' }}>
          <div className="card-title">Post Transaction</div>

          {submitSuccess && (
            <div className="alert alert-success">{submitSuccess}</div>
          )}
          <ErrorMessage message={submitError} onDismiss={() => setSubmitError(null)} />

          <form onSubmit={handleSubmit} noValidate>

            {/* Transaction Type */}
            <div className="form-group">
              <label className="form-label">
                Transaction Type <span className="required">*</span>
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['CREDIT', 'DEBIT'].map((type) => (
                  <label
                    key={type}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 20px',
                      border: `2px solid ${form.transactionType === type
                        ? (type === 'CREDIT' ? 'var(--success)' : 'var(--danger)')
                        : 'var(--border-dark)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: form.transactionType === type
                        ? (type === 'CREDIT' ? 'var(--success)' : 'var(--danger)')
                        : 'var(--text-secondary)',
                      background: form.transactionType === type
                        ? (type === 'CREDIT' ? 'var(--success-light)' : 'var(--danger-light)')
                        : '#fff',
                    }}
                  >
                    <input
                      type="radio"
                      name="transactionType"
                      value={type}
                      checked={form.transactionType === type}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    {type === 'CREDIT' ? '↑ Deposit' : '↓ Withdraw'}
                  </label>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label">
                Amount (₹) <span className="required">*</span>
              </label>
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                className={`form-input ${formErrors.amount ? 'error' : ''}`}
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
              />
              {formErrors.amount && <p className="form-error">{formErrors.amount}</p>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <input
                name="description"
                type="text"
                className="form-input"
                placeholder="e.g. Salary, ATM withdrawal"
                value={form.description}
                onChange={handleChange}
                maxLength={255}
              />
            </div>

            <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Processing…' : 'Post Transaction'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ErrorMessage message={error} onDismiss={() => {}} />

      {/* ── Transactions Table ── */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance After</th>
              <th>Description</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  No transactions yet. Post the first one above.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.transactionId}>
                  <td style={{ color: 'var(--text-muted)', width: '56px' }}>
                    {txn.transactionId}
                  </td>
                  <td><StatusBadge value={txn.transactionType} /></td>
                  <td className={txn.transactionType === 'CREDIT' ? 'amount-credit' : 'amount-debit'}>
                    {txn.transactionType === 'CREDIT' ? '+' : '-'}
                    ₹{Number(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{Number(txn.balanceAfter).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {txn.description || '—'}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                    {txn.timestamp
                      ? new Date(txn.timestamp).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })
                      : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
