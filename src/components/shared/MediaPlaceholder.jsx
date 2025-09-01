// components/shared/MediaPlaceholder.jsx
import React from 'react';
import { Image as ImageIcon, Camera } from 'lucide-react';

const MediaPlaceholder = ({
  ratio = '16/9', // '16/9' | '4/3' | '1/1' | '3/2'
  label = 'Placeholder', // teks kecil di tengah
  icon = 'image', // 'image' | 'camera'
  className = '',
}) => {
  const aspect = ratio === '1/1' ? 'aspect-square' : ratio === '4/3' ? 'aspect-[4/3]' : ratio === '3/2' ? 'aspect-[3/2]' : 'aspect-[16/9]';

  const Icon = icon === 'camera' ? Camera : ImageIcon;

  return (
    <div className={['relative overflow-hidden rounded-lg border border-gray-200', 'transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl-primary-500/30', aspect, className].join(' ')} aria-busy="true" aria-label={label}>
      {/* permukaan shimmer */}
      <div className="absolute inset-0 ph-surface" />
      {/* grid tipis */}
      <div className="absolute inset-0 ph-grid pointer-events-none" />
      {/* ikon + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
        <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center mb-2">
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
        {label && <span className="text-xs font-medium text-gray-700">{label}</span>}
      </div>
    </div>
  );
};

export default MediaPlaceholder;
