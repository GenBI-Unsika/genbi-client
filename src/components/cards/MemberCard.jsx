// components/cards/MemberCard.jsx
import React from 'react';

// helper: inisial dari nama
const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'GN';

const MemberCard = ({ member = {}, onClick }) => {
  const { name, jabatan, photo } = member;

  return (
    <button
      type="button"
      onClick={() => onClick?.(member)}
      className={[
        // base
        'group w-full text-left bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm',
        // animasi hover (pakai util shadow kustom-mu)
        'transform-gpu transition-transform duration-200 ease-out cursor-pointer hover:scale-[1.02] hover:shadow-xl-primary-500/30',
        // fokus keyboard
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2',
      ].join(' ')}
    >
      {/* Media */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={`Foto ${name}`}
            className="absolute inset-0 w-full h-full object-cover transform-gpu transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.removeAttribute('src');
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 text-primary-900 grid place-items-center font-semibold">{getInitials(name)}</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{name}</h3>
        <p className="text-gray-600 text-sm line-clamp-1">{jabatan}</p>
      </div>
    </button>
  );
};

export default MemberCard;
