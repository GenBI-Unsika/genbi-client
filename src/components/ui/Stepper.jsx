import clsx from 'clsx';

const Stepper = ({ current = 0, items = [], className }) => {
  return (
    <ul className={clsx('relative flex w-full justify-between', className)}>
      {items.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className={clsx("flex-1 group relative", i !== items.length - 1 && "pr-4")}>
            <div className="flex items-center">
              {/* Circle */}
              <div
                className={clsx(
                  "flex items-center justify-center rounded-full border-2 transition-all duration-300 z-10 relative bg-white",
                  active ? "w-10 h-10 border-primary-600 text-primary-600 shadow-[0_0_0_4px_rgba(1,49,159,0.1)]" : "w-8 h-8",
                  done ? "bg-primary-600 border-primary-600 text-white" : "border-neutral-300 text-neutral-400",
                  !active && !done && "bg-white"
                )}
              >
                {done ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={clsx("text-sm font-semibold", active && "text-lg")}>{i + 1}</span>
                )}
              </div>

              {/* Line Connector */}
              {i < items.length - 1 && (
                <div className={clsx("h-1 flex-1 mx-2 rounded", done ? "bg-primary-600" : "bg-neutral-200")} />
              )}
            </div>

            <div className="mt-2">
              <span className={clsx("block text-sm transition-colors duration-300", active ? "font-bold text-primary-800" : "font-medium text-neutral-500")}>
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
