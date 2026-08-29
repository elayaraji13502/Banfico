import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import customerService from '../services/customerService';
import ErrorMessage from '../components/ErrorMessage';

/**
 * CreateCustomer Page
 * Route: /customers/new
 *
 * CONTROLLED COMPONENTS (forms in React):
 * ────────────────────────────────────────
 * In plain HTML, the <input> owns its value — you read it with document.getElementById().
 * In React, WE own the value via useState. The input is "controlled" by React state.
 *
 *   value={form.fullName}               → React controls what's displayed
 *   onChange={(e) => handleChange(e)}   → React updates state on every keystroke
 *
 * Why controlled?
 *   - You can validate on every keystroke
 *   - You can reset the form programmatically
 *   - The state always mirrors what the user sees
 *
 * FORM VALIDATION:
 * ────────────────
 * We validate on the frontend BEFORE sending to the backend.
 * The backend ALSO validates (Spring @Valid) — both layers work together.
 * Frontend validation = instant feedback, no network round-trip.
 * Backend validation = safety net, prevents invalid data even from API clients.
 *
 * FORM SUBMISSION FLOW:
 * ─────────────────────
 *   1. User fills form and clicks Submit
 *   2. handleSubmit prevents default browser form submission (page reload)
 *   3. validate() checks all fields — shows inline errors if invalid
 *   4. If valid → customerService.create(form) → POST /api/customers
 *   5. On success → navigate('/customers') → go to Customer List
 *   6. On error   → show error message from backend
 */
export default function CreateCustomer() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email:    '',
    phone:    '',
    address:  '',
  });

  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // ── Controlled input handler ──
  // One handler for all fields — reads the field's name attribute
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Frontend validation ──
  const validate = () => {
    const errs = {};
    if (!form.fullName.trim())
      errs.fullName = 'Full name is required';
    else if (form.fullName.trim().length < 2)
      errs.fullName = 'Full name must be at least 2 characters';

    if (!form.email.trim())
      errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address';

    if (!form.phone.trim())
      errs.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(form.phone))
      errs.phone = 'Phone must be exactly 10 digits';

    return errs;
  };

  // ── Form submission ──
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent browser from reloading the page

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setServerError(null);
      await customerService.create(form);
      navigate('/customers'); // go back to list on success
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">

      <Link to="/customers" className="back-link">← Back to Customers</Link>

      <div className="page-header">
        <h1 className="page-title">New Customer</h1>
      </div>

      <div className="form-card">
        <ErrorMessage message={serverError} onDismiss={() => setServerError(null)} />

        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="e.g. John Doe"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.fullName && <p className="form-error">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number <span className="required">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="10-digit number"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              autoComplete="tel"
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-input"
              placeholder="Street, City, State"
              value={form.address}
              onChange={handleChange}
              autoComplete="street-address"
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating…' : 'Create Customer'}
            </button>
            <Link to="/customers" className="btn btn-secondary">Cancel</Link>
          </div>

        </form>
      </div>

    </div>
  );
}
