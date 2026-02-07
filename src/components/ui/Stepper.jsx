import clsx from 'clsx';

const Stepper = ({ current = 0, items = [], className }) => {
  return (
    <ul className={clsx('relative flex w-full gap-x-2', className)}>
      {items.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="group flex-1 shrink basis-0">
            <div className="min-h-7.5 min-w-7.5 inline-flex w-full items-center align-middle text-sm">
              <span
                className={clsx('size-7.5 flex shrink-0 items-center justify-center rounded-full text-sm font-medium')}
                style={{
                  backgroundColor: done ? 'var(--primary-600)' : '#fff',
                  color: done ? '#fff' : active ? 'var(--primary-700)' : 'var(--neutral-400)',
                  border: done ? '1px solid var(--primary-600)' : '1px solid var(--neutral-200)',
                  // kontras ekstra untuk step aktif
                  boxShadow: active ? '0 0 0 3px rgba(1,49,159,0.20)' : 'none',
                }}
              >
                {i + 1}
              </span>
              <div className="ms-2 h-px w-full flex-1 group-last:hidden" style={{ backgroundColor: 'var(--neutral-200)' }} />
            </div>
            <div className="mt-2.5">
              <span
                className="block"
                style={{
                  color: active ? 'var(--primary-700)' : 'var(--neutral-600)',
                  fontWeight: active ? 600 : 500,
                }}
              >
                {label}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Stepper;
