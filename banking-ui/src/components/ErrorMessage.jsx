/**
 * ErrorMessage Component
 *
 * Displays a dismissible error alert when an API call fails.
 *
 * Props:
 *   message — the error string to show
 *   onDismiss — optional callback to clear the error (shows × button)
 *
 * The error text comes from our Axios interceptor in api.js which
 * extracts the "message" field from the ApiResponse.error() envelope.
 *
 * Example:
 *   Backend returns: { success: false, message: "Customer not found with id: 99" }
 *   Interceptor rejects with: new Error("Customer not found with id: 99")
 *   Hook stores: error = "Customer not found with id: 99"
 *   This component displays that string.
 */
export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="alert alert-error" role="alert">
      <span style={{ flex: 1 }}>⚠ {message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            color: 'inherit',
            padding: '0 4px',
            lineHeight: 1,
          }}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}
