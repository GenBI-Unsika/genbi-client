import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

function buildPageItems(currentPage, totalPages) {
    const safeTotal = Math.max(1, Number(totalPages) || 1);
    const safeCurrent = Math.min(Math.max(1, Number(currentPage) || 1), safeTotal);

    const windowSize = 2;
    const start = Math.max(2, safeCurrent - windowSize);
    const end = Math.min(safeTotal - 1, safeCurrent + windowSize);

    const items = [1];

    if (start > 2) items.push('ellipsis-left');
    for (let p = start; p <= end; p += 1) items.push(p);
    if (end < safeTotal - 1) items.push('ellipsis-right');

    if (safeTotal > 1) items.push(safeTotal);

    return { safeCurrent, safeTotal, items };
}

const Pagination = ({ currentPage, totalPages, onPageChange, disabled = false, className = '' }) => {
    const { safeCurrent, safeTotal, items } = buildPageItems(currentPage, totalPages);
    const canPrev = safeCurrent > 1;
    const canNext = safeCurrent < safeTotal;

    if (safeTotal <= 1) return null;

    return (
        <div className={`flex justify-center items-center gap-2 flex-wrap ${className}`}>
            <button
                type="button"
                onClick={() => (canPrev && !disabled ? onPageChange(1) : null)}
                disabled={!canPrev || disabled}
                className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                aria-label="Halaman pertama"
                title="Halaman pertama"
            >
                <ChevronsLeft className="w-5 h-5" />
            </button>

            <button
                type="button"
                onClick={() => (canPrev && !disabled ? onPageChange(safeCurrent - 1) : null)}
                disabled={!canPrev || disabled}
                className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                aria-label="Sebelumnya"
                title="Sebelumnya"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {items.map((it, idx) => {
                if (typeof it !== 'number') {
                    return (
                        <span key={`${it}-${idx}`} className="px-1 text-gray-500 select-none">
                            …
                        </span>
                    );
                }

                const active = it === safeCurrent;
                return (
                    <button
                        key={it}
                        type="button"
                        onClick={() => (!disabled ? onPageChange(it) : null)}
                        disabled={disabled}
                        aria-current={active ? 'page' : undefined}
                        className={
                            active
                                ? 'min-w-[44px] min-h-[44px] px-3 rounded-full bg-gray-900 text-white font-medium transition-colors shadow-sm'
                                : 'min-w-[44px] min-h-[44px] px-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
                        }
                    >
                        {it}
                    </button>
                );
            })}

            <button
                type="button"
                onClick={() => (canNext && !disabled ? onPageChange(safeCurrent + 1) : null)}
                disabled={!canNext || disabled}
                className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                aria-label="Berikutnya"
                title="Berikutnya"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            <button
                type="button"
                onClick={() => (canNext && !disabled ? onPageChange(safeTotal) : null)}
                disabled={!canNext || disabled}
                className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                aria-label="Halaman terakhir"
                title="Halaman terakhir"
            >
                <ChevronsRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
