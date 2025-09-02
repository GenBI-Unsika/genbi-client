import clsx from 'clsx';

const StepperFlyonVertical = ({ items = [], current = 0, className, heightClass = 'h-96' }) => {
  return (
    <ul className={clsx('relative flex flex-col gap-y-2', heightClass, className)}>
      {items.map((label, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <li key={label} className="group flex flex-1 shrink basis-0 flex-col w-fit">
            <div className="flex items-center justify-center gap-2.5 text-sm">
              <span
                className="size-7.5 flex shrink-0 items-center justify-center rounded-full text-sm font-medium"
                style={{
                  backgroundColor: done ? 'var(--primary-600)' : '#fff',
                  color: done ? '#fff' : active ? 'var(--primary-700)' : 'var(--neutral-400)',
                  border: done ? '1px solid var(--primary-600)' : '1px solid var(--neutral-200)',
                  boxShadow: active ? '0 0 0 3px rgba(1,49,159,0.20)' : 'none',
                }}
                aria-current={active ? 'step' : undefined}
              >
                {i + 1}
              </span>
              <div className={clsx('block', active ? 'font-semibold' : 'font-medium')} style={{ color: active ? 'var(--primary-700)' : 'var(--neutral-600)' }}>
                {label}
              </div>
            </div>

            {/* connector line */}
            <div className="ms-3.5 mt-2 h-full w-px justify-self-start group-last:hidden" style={{ backgroundColor: 'var(--neutral-200)' }} />
          </li>
        );
      })}
    </ul>
  );
};

export default StepperFlyonVertical;
