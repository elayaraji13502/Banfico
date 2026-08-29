import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBeneficiaries } from '../hooks/useBeneficiaries';
import { useCustomers } from '../hooks/useCustomers';
import beneficiaryService from '../services/beneficiaryService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';

/**
 * BeneficiaryList Page
 * Route: /beneficiaries
 *
 * Displays all saved beneficiaries and provides an inline
 * form to add a new one. Also supports deleting a beneficiary.
 */
export default function BeneficiaryList() {
  const { beneficiaries, loading, error, refetch } = useBeneficiaries();
  const { customers, loading: custLoading }        = useCustomers();

  // Create form
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState({ beneficiaryName: '', bankName: '', accountNumber: '', customerId: '' });
  const [formErrors, setFormErrors]   = useState({});
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.customerId)             errs.customerId        = 'Please select a customer';
    if (!form.beneficiaryName.trim()) errs.beneficiaryName   = 'Beneficiary name is required';
    if (!form.bankName.trim())        errs.bankName          = 'Bank name is required';
    if (!form.accountNumber.trim())   errs.accountNumber     = 'Account number is required';
    else if (!/^[0-9]{9,18}$/.test(form.accountNumber))
                                      errs.accountNumber     = 'Account number must be 9–18 digits';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    try {
      setSubmitting(true);
      setSubmitError(null);
      await beneficiaryService.create({
        ...form,
        customerId: parseInt(form.customerId, 10),
      });
      setForm({ beneficiaryName: '', bankName: '', accountNumber: '', customerId: '' });
      setShowForm(false);
      refetch();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await beneficiaryService.remove(deleteTarget.beneficiaryId);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader message="Loading beneficiaries..." />;

  return (
    <div className="page-wrapper">

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Beneficiaries</h1>
          <p className="page-subtitle">
            {beneficiaries.length} saved payee{beneficiaries.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm((v) => !v); setSubmitError(null); }}>
          {showForm ? '✕ Cancel' : '+ Add Beneficiary'}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showForm && (
        <div className="form-card" style={{ marginBottom: '24px', maxWidth: '100%' }}>
          <div className="card-title">Add New Beneficiary</div>
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
                    <option key={c.id} value={c.id}>{c.fullName}</option>
                  ))}
                </select>
                {formErrors.customerId && <p className="form-error">{formErrors.customerId}</p>}
              </div>

              {/* Beneficiary Name */}
              <div className="form-group">
                <label className="form-label">
                  Beneficiary Name <span className="required">*</span>
                </label>
                <input
                  name="beneficiaryName"
                  type="text"
                  className={`form-input ${formErrors.beneficiaryName ? 'error' : ''}`}
                  placeholder="e.g. Jane Smith"
                  value={form.beneficiaryName}
                  onChange={handleChange}
                />
                {formErrors.beneficiaryName && <p className="form-error">{formErrors.beneficiaryName}</p>}
              </div>

              {/* Bank Name */}
              <div className="form-group">
                <label className="form-label">
                  Bank Name <span className="required">*</span>
                </label>
                <input
                  name="bankName"
                  type="text"
                  className={`form-input ${formErrors.bankName ? 'error' : ''}`}
                  placeholder="e.g. HDFC Bank"
                  value={form.bankName}
                  onChange={handleChange}
                />
                {formErrors.bankName && <p className="form-error">{formErrors.bankName}</p>}
              </div>

              {/* Account Number */}
              <div className="form-group">
                <label className="form-label">
                  Account Number <span className="required">*</span>
                </label>
                <input
                  name="accountNumber"
                  type="text"
                  className={`form-input ${formErrors.accountNumber ? 'error' : ''}`}
                  placeholder="9–18 digit account number"
                  value={form.accountNumber}
                  onChange={handleChange}
                  maxLength={18}
                />
                {formErrors.accountNumber && <p className="form-error">{formErrors.accountNumber}</p>}
              </div>

            </div>
            <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : 'Add Beneficiary'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <ErrorMessage message={error}       onDismiss={() => {}} />
      <ErrorMessage message={deleteError} onDismiss={() => setDeleteError(null)} />

      {/* ── Beneficiaries Table ── */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Beneficiary Name</th>
              <th>Bank</th>
              <th>Account Number</th>
              <th>Customer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  No beneficiaries saved yet. Add one above.
                </td>
              </tr>
            ) : (
              beneficiaries.map((b) => (
                <tr key={b.beneficiaryId}>
                  <td style={{ color: 'var(--text-muted)', width: '48px' }}>{b.beneficiaryId}</td>
                  <td style={{ fontWeight: 600 }}>{b.beneficiaryName}</td>
                  <td>{b.bankName}</td>
                  <td style={{ fontFamily: 'monospace' }}>{b.accountNumber}</td>
                  <td>
                    <Link to={`/customers/${b.customerId}`} style={{ fontWeight: 500 }}>
                      {b.customerName}
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteTarget(b)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Confirm Delete ── */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Remove "${deleteTarget.beneficiaryName}" (${deleteTarget.accountNumber}) from saved beneficiaries?`}
          onConfirm={handleDelete}
          onCancel={() => { setDeleteTarget(null); setDeleteError(null); }}
          loading={deleting}
        />
      )}

    </div>
  );
}
