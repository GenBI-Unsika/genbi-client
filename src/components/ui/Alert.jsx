const tone = {
  error: {
    bg: 'var(--secondary-50)',
    border: 'var(--secondary-400)',
    text: 'var(--secondary-700)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M11 7h2v6h-2zm0 8h2v2h-2z" />
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
         10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8
         8-8 8 3.59 8 8-3.59 8-8 8z"
        />
      </svg>
    ),
  },
};

const Alert = ({ show, title, message, onClose, variant = 'error' }) => {
  if (!show) return null;
  const p = tone[variant];

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border px-4 py-3"
      style={{
        backgroundColor: p.bg,
        borderColor: p.border,
        color: p.text,
      }}
    >
      <div className="mt-0.5">{p.icon}</div>
      <div className="text-sm">
        {title && <p className="font-semibold">{title}</p>}
        {message && <p>{message}</p>}
      </div>
      <button type="button" onClick={onClose} className="ml-auto opacity-70 transition hover:opacity-100" aria-label="Tutup" title="Tutup">
        ×
      </button>
    </div>
  );
};

export default Alert;
