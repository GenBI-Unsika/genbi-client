import { useState } from 'react';
import PropTypes from 'prop-types';
import { normalizeFileUrl } from '../../utils/api';

const Image = ({ src, alt = '', fallback = null, fallbackSrc = '', className = '', onError, onLoad, loading = 'lazy', ...props }) => {
  const [hasError, setHasError] = useState(false);

  const normalizedSrc = normalizeFileUrl(src);

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  const handleLoad = (e) => {
    onLoad?.(e);
  };

  if (hasError || !normalizedSrc) {
    if (fallback) {
      return fallback;
    }
    if (fallbackSrc) {
      return <img src={fallbackSrc} alt={alt} className={className} loading={loading} referrerPolicy="no-referrer" {...props} />;
    }
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} {...props}>
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  return <img src={normalizedSrc} alt={alt} className={className} loading={loading} onError={handleError} onLoad={handleLoad} referrerPolicy="no-referrer" {...props} />;
};

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  fallback: PropTypes.node,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  loading: PropTypes.oneOf(['lazy', 'eager']),
};

export default Image;

export const Avatar = ({ src, name = '', size = 40, className = '', ...props }) => {
  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=4F46E5&color=fff&size=${size * 2}`;

  return <Image src={src} alt={name || 'Avatar'} fallbackSrc={fallbackSrc} className={`rounded-full object-cover ${className}`} style={{ width: size, height: size }} {...props} />;
};

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
};

export const CoverImage = ({ src, alt = 'Cover image', aspectRatio = '16/10', className = '', fallback, ...props }) => {
  const defaultFallback = (
    <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{ aspectRatio }}>
      <span className="text-gray-400 text-sm">Tidak ada cover</span>
    </div>
  );

  return (
    <div className="relative" style={{ aspectRatio }}>
      <Image src={src} alt={alt} fallback={fallback || defaultFallback} className={`absolute inset-0 w-full h-full object-cover ${className}`} {...props} />
    </div>
  );
};

CoverImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  aspectRatio: PropTypes.string,
  className: PropTypes.string,
  fallback: PropTypes.node,
};
