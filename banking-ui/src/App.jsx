import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Pages
import Dashboard         from './pages/Dashboard';
import CustomerList      from './pages/CustomerList';
import CreateCustomer    from './pages/CreateCustomer';
import CustomerDetail    from './pages/CustomerDetail';
import AccountList       from './pages/AccountList';
import AccountDetail     from './pages/AccountDetail';
import TransactionHistory from './pages/TransactionHistory';
import BeneficiaryList   from './pages/BeneficiaryList';

/**
 * App.jsx — Root Component
 *
 * WHAT IS REACT ROUTER?
 * ──────────────────────
 * React Router is a library that maps URL paths to React components.
 * It enables Single Page Application (SPA) behaviour:
 *   - URL changes without a full page reload
 *   - Only the relevant component re-renders
 *   - Browser back/forward buttons work correctly
 *
 * Key components:
 *   <BrowserRouter>  → provides routing context to the whole app
 *                      Uses the HTML5 History API (real URLs, no #)
 *
 *   <Routes>         → container for all route definitions
 *                      Renders only the FIRST matching <Route>
 *
 *   <Route path="x" element={<Component />} />
 *                    → when the URL matches "x", render Component
 *
 *   <Navigate to="x" /> → immediately redirects to another route
 *                         Used here so /beneficiaries/new redirects
 *                         to /beneficiaries (list has the inline form)
 *
 * Route parameters (:id):
 *   /customers/:id  → matches /customers/1, /customers/42, etc.
 *   The ":id" part is a URL parameter, read with useParams() in the component.
 *
 * COMPONENT TREE:
 * ──────────────
 * App
 * └── BrowserRouter
 *     ├── Navbar (always visible — outside Routes)
 *     └── main (page content area)
 *         └── Routes
 *             ├── /                           → Dashboard
 *             ├── /customers                  → CustomerList
 *             ├── /customers/new              → CreateCustomer
 *             ├── /customers/:id              → CustomerDetail
 *             ├── /accounts                   → AccountList
 *             ├── /accounts/:id               → AccountDetail
 *             ├── /accounts/:id/transactions  → TransactionHistory
 *             ├── /beneficiaries              → BeneficiaryList
 *             ├── /beneficiaries/new          → redirect to /beneficiaries
 *             └── *                           → redirect to /
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar renders on every page — it lives outside <Routes> */}
      <Navbar />

      {/* Page content — min-height ensures footer-like behaviour */}
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Routes>

          {/* ── Dashboard ── */}
          <Route path="/" element={<Dashboard />} />

          {/* ── Customers ── */}
          <Route path="/customers"      element={<CustomerList />} />
          <Route path="/customers/new"  element={<CreateCustomer />} />
          <Route path="/customers/:id"  element={<CustomerDetail />} />

          {/* ── Accounts ── */}
          <Route path="/accounts"      element={<AccountList />} />
          <Route path="/accounts/:id"  element={<AccountDetail />} />

          {/* ── Transactions (nested under account) ── */}
          <Route
            path="/accounts/:id/transactions"
            element={<TransactionHistory />}
          />

          {/* ── Beneficiaries ── */}
          <Route path="/beneficiaries"      element={<BeneficiaryList />} />
          {/* /new redirects to list — the add form is inline on the list page */}
          <Route
            path="/beneficiaries/new"
            element={<Navigate to="/beneficiaries" replace />}
          />

          {/* ── Catch-all — redirect unknown URLs to home ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>
    </BrowserRouter>
  );
}
