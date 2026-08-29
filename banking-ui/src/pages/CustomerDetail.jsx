import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomers';
import { useAccounts } from '../hooks/useAccounts';
import { useBeneficiaries } from '../hooks/useBeneficiaries';
import customerService from '../services/customerService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';

/**
 * CustomerDetail Page
 * Route: /customers/:id
 *
 * useParams():
 *   Reads URL parameters. For route /customers/:id, when the URL is
 *   /customers/5, useParams() returns { id: '5' } (always a string).
 *   We parse it to a number with parseInt before passing to the hook.
 *
 * This page shows:
 *   1. Customer info panel (name, email, phone, address, joined date)
 *   2. Their accounts table with links to account detail
 *   3. Their beneficiaries table
 *   4. Edit form (inline — toggled with showEdit state)
 *   5. Delete button with confirm dialog
 */
export default function CustomerDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const customerId = parseInt(id, 10);

  const { customer, loading, error, refetch }             = useCustomer(customerId);
  const { accounts, loading: accLoading }                 = useAccounts(customerId);
  const { beneficiaries, loading: benLoading }            = useBeneficiaries(customerId);

  // Edit state
  const [showEdit, setShowEdit]         = useState(false);
  const [editForm, setEditForm]         = useState({});
  const [editErrors, setEditErrors]     = useState({});
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState(null);

  // Delete state
  const [showDelete, setShowDelete]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState(null);

  // ── Open edit form pre-filled with current customer data ──
  const handleOpenEdit = () => {
    setEditForm({
      fullName: customer.fullName,
      email:    customer.email,
      phone:    customer.phone,
      address:  customer.address || '',
    });
    setEditErrors({});
    setSaveError(null);
    setShowEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) setEditErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateEdit = () => {
    const errs = {};
    if (!editForm.fullName?.trim()) errs.fullName = 'Full name is required';
    if (!editForm.email?.trim())    errs.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email))
      errs.email = 'Enter a valid email address';
    if (!editForm.phone?.trim())    errs.phone    = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(editForm.phone))
      errs.phone = 'Phone must be 10 digits';
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validateEdit();
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }

    try {
      setSaving(true);
      setSaveError(null);
      await customerService.update(customerId, editForm);
      setShowEdit(false);
      refetch();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await customerService.remove(customerId);
      navigate('/customers');
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  // ── Render states ──
  if (loading) return <Loader message="Loading customer..." />;
  if (error)   return (
    <div className="page-wrapper">
      <Link to="/customers" className="back-link">← Back to Customers</Link>
      <ErrorMessage message={error} />
    </div>
  );
  if (!customer) return null;

  return (
    <div className="page-wrapper">

      <Link to="/customers" className="back-link">← Back to Customers</Link>

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{customer.fullName}</h1>
          <p className="page-subtitle">Customer ID: {customer.id}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleOpenEdit}>Edit</button>
          <button className="btn btn-danger"    onClick={() => setShowDelete(true)}>Delete</button>
        </div>
      </div>

      <ErrorMessage message={deleteError} onDismiss={() => setDeleteError(null)} />

      {/* ── Customer Info ── */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">Customer Information</div>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">Full Name</div>
            <div className="detail-value">{customer.fullName}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Email</div>
            <div className="detail-value">{customer.email}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Phone</div>
            <div className="detail-value">{customer.phone}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Address</div>
            <div className="detail-value">{customer.address || '—'}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Member Since</div>
            <div className="detail-value">
              {customer.createdAt
                ? new Date(customer.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })
                : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Accounts ── */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Accounts ({accounts.length})</span>
          <Link to="/accounts" className="btn btn-secondary btn-sm">+ Open Account</Link>
        </div>
        {accLoading ? <Loader message="Loading accounts..." /> : (
          <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length === 0 ? (
                  <tr><td colSpan={5} className="table-empty">No accounts yet.</td></tr>
                ) : (
                  accounts.map((acc) => (
                    <tr key={acc.accountId}>
                      <td style={{ fontWeight: 600 }}>{acc.accountNumber}</td>
                      <td><StatusBadge value={acc.accountType} /></td>
                      <td style={{ fontWeight: 600 }}>
                        ₹{Number(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td><StatusBadge value={acc.status} /></td>
                      <td>
                        <Link to={`/accounts/${acc.accountId}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Beneficiaries ── */}
      <div className="card">
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Beneficiaries ({beneficiaries.length})</span>
          <Link to="/beneficiaries/new" className="btn btn-secondary btn-sm">+ Add Beneficiary</Link>
        </div>
        {benLoading ? <Loader message="Loading beneficiaries..." /> : (
          <div className="table-wrapper" style={{ border: 'none', boxShadow: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Bank</th>
                  <th>Account Number</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.length === 0 ? (
                  <tr><td colSpan={3} className="table-empty">No beneficiaries saved.</td></tr>
                ) : (
                  beneficiaries.map((b) => (
                    <tr key={b.beneficiaryId}>
                      <td style={{ fontWeight: 600 }}>{b.beneficiaryName}</td>
                      <td>{b.bankName}</td>
                      <td style={{ fontFamily: 'monospace' }}>{b.accountNumber}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {showEdit && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '16px',
        }}>
          <div style={{
            background: '#fff', borderRadius: '10px', padding: '28px 32px',
            maxWidth: '500px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
              Edit Customer
            </h2>
            <ErrorMessage message={saveError} onDismiss={() => setSaveError(null)} />
            <form onSubmit={handleSave} noValidate>
              {['fullName', 'email', 'phone', 'address'].map((field) => (
                <div className="form-group" key={field}>
                  <label className="form-label" htmlFor={`edit-${field}`}>
                    {field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                    {field !== 'address' && <span className="required"> *</span>}
                  </label>
                  <input
                    id={`edit-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    className={`form-input ${editErrors[field] ? 'error' : ''}`}
                    value={editForm[field] || ''}
                    onChange={handleEditChange}
                  />
                  {editErrors[field] && <p className="form-error">{editErrors[field]}</p>}
                </div>
              ))}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEdit(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {showDelete && (
        <ConfirmDialog
          message={`Permanently delete "${customer.fullName}"? All their accounts, transactions, and beneficiaries will also be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}

    </div>
  );
}
