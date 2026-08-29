/**
 * StatusBadge Component
 *
 * Renders a coloured pill badge for Account status and Transaction type.
 * Centralises the status → colour mapping so it's consistent everywhere.
 *
 * Props:
 *   value — the status/type string from the backend
 *           e.g. "ACTIVE", "INACTIVE", "SUSPENDED", "CLOSED",
 *                "CREDIT", "DEBIT",
 *                "SAVINGS", "CURRENT", "FIXED_DEPOSIT"
 *
 * The badge CSS classes (.badge-success, .badge-danger, etc.)
 * are defined in index.css.
 */
const STATUS_MAP = {
  // Account status
  ACTIVE:        { label: 'Active',        cls: 'badge-success'  },
  INACTIVE:      { label: 'Inactive',      cls: 'badge-neutral'  },
  SUSPENDED:     { label: 'Suspended',     cls: 'badge-warning'  },
  CLOSED:        { label: 'Closed',        cls: 'badge-danger'   },

  // Transaction type
  CREDIT:        { label: 'Credit',        cls: 'badge-success'  },
  DEBIT:         { label: 'Debit',         cls: 'badge-danger'   },

  // Account type
  SAVINGS:       { label: 'Savings',       cls: 'badge-primary'  },
  CURRENT:       { label: 'Current',       cls: 'badge-primary'  },
  FIXED_DEPOSIT: { label: 'Fixed Deposit', cls: 'badge-primary'  },
};

export default function StatusBadge({ value }) {
  if (!value) return null;

  const config = STATUS_MAP[value] ?? { label: value, cls: 'badge-neutral' };

  return (
    <span className={`badge ${config.cls}`}>
      {config.label}
    </span>
  );
}
