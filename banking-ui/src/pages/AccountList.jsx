import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { useCustomers } from '../hooks/useCustomers';
import accountService from '../services/accountService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';

/**
 * AccountList Page
 * Route: /accounts
 *
 * Shows all accounts in the system with an optional
 * inline "Open New Account" form.
 *
 * The form needs the customer list to populate the
 * customer dropdown — both hooks run in parallel.
 */
export default function AccountList() {
  const { accounts, loading, error, refetch } = useAccounts();
  const { customers, loading: custLoading }   = useCustomers();
  const navigate = useNavigate();

  // Create account form
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState({ accountType: 'SAVINGS', initialDeposit: '', customerId: '' });
  const [formErrors, setFormErrors]   = useState({});
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.customerId)       errs.customerId     = 'Please select a customer';
    if (!form.accountType)      errs.accountType    = 'Account type is required';
    if (form.initialDeposit === '' || form.initialDeposit === undefined)
                                errs.initialDeposit = 'Initial deposit is required';
    else if (Number(form.initialDeposit) < 0)
                                errs.initialDeposit = 'Deposit cannot be negative';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    try {
      setSubmitting(true);
      setSubmitError(null);
      await accountService.create({
        accountType:    form.accountType,
        initialDeposit: parseFloat(form.initialDeposit),
        customerId:     parseInt(form.customerId, 10),
      });
      setForm({ accountType: 'SAVINGS', initialDeposit: '', customerId: '' });
      setShowForm(false);
      refetch();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading accounts..." />;

  return (
    <div className="page-wrapper">

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Accounts</h1>
          <p className="page-subtitle">{accounts.length} account{accounts.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? '✕ Cancel' : '+ Open Account'}
        </button>
      </div>

      {/* ── Inline Create Form ── */}
      {showForm && (
        <div className="form-card" style={{ marginBottom: '24px', maxWidth: '100%' }}>
          <div className="card-title">Open New Bank Account</div>
          <ErrorMessage message={submitError} onDismiss={() => setSubmitError(null)} />
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">

              {/* Customer */}
              <div className="form-group">
                <label className="form-label">
                  Customer <span className="required">*</span>
                </label>
                <select
                  name="customerId"
                  className={`form-select ${formErrors.customerId ? 'error' : ''}`}
                  value={form.customerId}
                  onChange={handleChange}
                  disabled={custLoading}
                >
                  <option value="">— Select Customer —</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.email})</option>
                  ))}
                </select>
                {formErrors.customerId && <p className="form-error">{formErrors.customerId}</p>}
              </div>

              {/* Account Type */}
              <div className="form-group">
                <label className="form-label">
                  Account Type <span className="required">*</span>
                </label>
                <select
                  name="accountType"
                  className={`form-select ${formErrors.accountType ? 'error' : ''}`}
                  value={form.accountType}
                  onChange={handleChange}
                >
                  <option value="SAVINGS">Savings</option>
                  <option value="CURRENT">Current</option>
                  <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                </select>
                {formErrors.accountType && <p className="form-error">{formErrors.accountType}</p>}
              </div>

              {/* Initial Deposit */}
              <div className="form-group">
                <label className="form-label">
                  Initial Deposit (₹) <span className="required">*</span>
                </label>
                <input
                  name="initialDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`form-input ${formErrors.initialDeposit ? 'error' : ''}`}
                  placeholder="0.00"
                  value={form.initialDeposit}
                  onChange={handleChange}
                />
                {formErrors.initialDeposit && <p className="form-error">{formErrors.initialDeposit}</p>}
              </div>

            </div>
            <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating…' : 'Open Account'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <ErrorMessage message={error} onDismiss={() => {}} />

      {/* ── Accounts Table ── */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Customer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  No accounts found. Open the first account above.
                </td>
              </tr>
            ) : (
              accounts.map((acc) => (
                <tr
                  key={acc.accountId}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/accounts/${acc.accountId}`)}
                >
                  <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {acc.accountNumber}
                  </td>
                  <td><StatusBadge value={acc.accountType} /></td>
                  <td style={{ fontWeight: 700 }}>
                    ₹{Number(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td><StatusBadge value={acc.status} /></td>
                  <td>
                    {acc.customer
                      ? <Link
                          to={`/customers/${acc.customer.id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ fontWeight: 500 }}
                        >
                          {acc.customer.fullName}
                        </Link>
                      : '—'}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/accounts/${acc.accountId}`} className="btn btn-secondary btn-sm">
                        View
                      </Link>
                      <Link
                        to={`/accounts/${acc.accountId}/transactions`}
                        className="btn btn-primary btn-sm"
                      >
                        Transactions
                      </Link>
                    </div>
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
