import clsx from 'clsx';

export const FieldLabel = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-neutral-700">
    {children}{' '}
    {required && (
      <span className="text-red-500" aria-hidden>
        *
      </span>
    )}
  </label>
);

const base = 'h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

export const TextInput = ({ className, ...props }) => <input {...props} className={clsx(base, className)} />;

export const Select = ({ className, children, ...props }) => (
  <select {...props} className={clsx(base, 'pr-8', className)}>
    {children}
  </select>
);

export const Textarea = ({ className, rows = 4, ...props }) => (
  <textarea
    rows={rows}
    {...props}
    className={clsx('w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary', className)}
  />
);

export const Field = ({ children }) => <div className="space-y-2">{children}</div>;
