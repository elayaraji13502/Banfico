/**
 * Loader Component
 *
 * Shown while an Axios request is in-flight (loading = true in hooks).
 *
 * Props:
 *   message — optional text below the spinner (default: "Loading...")
 *
 * WHY A LOADING STATE?
 * ────────────────────
 * API calls are asynchronous — they take time (network latency, DB query).
 * Without a loading state, the page would show an empty table with no
 * feedback, which looks broken to the user.
 * With a loading state, the user sees a spinner and knows data is coming.
 *
 * PROPS in React:
 * ────────────────
 * Props are like function parameters — the parent passes data to the child.
 * <Loader message="Fetching customers..." />
 * Inside Loader: props.message = "Fetching customers..."
 * With destructuring: function Loader({ message }) { ... }
 */
export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader-wrapper">
      <div className="spinner" />
      <span>{message}</span>
    </div>
  );
}
