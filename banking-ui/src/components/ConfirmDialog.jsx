/**
 * ConfirmDialog Component
 *
 * A simple inline confirmation prompt shown before destructive actions
 * (e.g. deleting a customer). Replaces window.confirm() with styled UI.
 *
 * Props:
 *   message    — question to ask the user
 *   onConfirm  — called when user clicks "Delete"
 *   onCancel   — called when user clicks "Cancel"
 *   loading    — disables buttons while the delete request is in-flight
 */
export default function ConfirmDialog({ message, onConfirm, onCancel, loading }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '28px 32px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
      >
        <p style={{ fontSize: '1rem', marginBottom: '24px', lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
