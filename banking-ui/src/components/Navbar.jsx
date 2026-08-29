import { NavLink } from 'react-router-dom';

/**
 * Navbar Component
 *
 * WHAT IS A COMPONENT?
 * ────────────────────
 * A React component is a JavaScript function that returns JSX (HTML-like syntax).
 * It is the building block of every React UI.
 * Components are reusable — Navbar renders once here and appears on every page.
 *
 * NavLink (from react-router-dom):
 *   Like <a href="..."> but React-aware.
 *   It does NOT reload the page — it updates the URL and renders the new
 *   component instantly. This is called client-side navigation (SPA behaviour).
 *
 *   className={({ isActive }) => isActive ? 'active' : ''}
 *   NavLink automatically tells you if the current URL matches its `to` prop.
 *   We use that to apply the "active" CSS class for the highlighted nav link.
 */
export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">
        🏦 <span>Banfico</span> Banking
      </span>

      <ul className="navbar-links">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/customers"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/accounts"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Accounts
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/beneficiaries"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Beneficiaries
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
