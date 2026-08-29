import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import customerService from '../services/customerService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';

/**
 * CustomerList Page
 * Route: GET /customers
 *
 * useNavigate:
 *   Programmatic navigation — navigate('/customers/5') takes the user
 *   to that URL without them clicking a link.
 *   Used here to go to Customer Detail after clicking a row.
 *
 * Delete flow:
 *   1. User clicks Delete → ConfirmDialog appears (no reload)
 *   2. User confirms → customerService.remove(id) called
 *   3. On success → refetch() re-runs GET /api/customers automatically
 *   4. Table updates without a page reload — this is the React way
 */
export default function CustomerList() {
  const { customers, loading, error, refetch } = useCustomers();
  const navigate = useNavigate();

  const [deleteTarget, setDeleteTarget] = useState(null); // customer to delete
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState(null);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await customerService.remove(deleteTarget.id);
      setDeleteTarget(null);
      refetch(); // refresh the list from the server
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader message="Loading customers..." />;

  return (
    <div className="page-wrapper">

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{customers.length} customer{customers.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Link to="/customers/new" className="btn btn-primary">+ New Customer</Link>
      </div>

      <ErrorMessage message={error}       onDismiss={() => {}} />
      <ErrorMessage message={deleteError} onDismiss={() => setDeleteError(null)} />

      {/* ── Table ── */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  No customers found.{' '}
                  <Link to="/customers/new">Create the first one.</Link>
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr
                  key={c.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/customers/${c.id}`)}
                >
                  <td style={{ color: 'var(--text-muted)', width: '48px' }}>{c.id}</td>
                  <td style={{ fontWeight: 600 }}>{c.fullName}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.address || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {/* stopPropagation prevents row click when clicking buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        to={`/customers/${c.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        View
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(c)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Confirm Delete Dialog ── */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete customer "${deleteTarget.fullName}"? This will also delete all their accounts, transactions, and beneficiaries.`}
          onConfirm={handleDelete}
          onCancel={() => { setDeleteTarget(null); setDeleteError(null); }}
          loading={deleting}
        />
      )}

    </div>
  );
}
