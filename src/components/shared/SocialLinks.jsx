/* eslint-disable react/prop-types */

const InstagramColorIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#f09433', stopOpacity: 1 }} />
        <stop offset="25%" style={{ stopColor: '#e6683c', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#dc2743', stopOpacity: 1 }} />
        <stop offset="75%" style={{ stopColor: '#cc2366', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#bc1888', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#instagram-gradient)" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#instagram-gradient)" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#instagram-gradient)" />
  </svg>
);

const iconSize = (size) => {
  switch (size) {
    case 'sm':
      return 'w-4 h-4';
    case 'lg':
      return 'w-6 h-6';
    default:
      return 'w-5 h-5';
  }
};

const SocialLinks = ({ links = {}, size = 'md', variant = 'icons' }) => {
  const safeLinks = links ?? {};

  const getInstagramUrl = (input) => {
    if (!input) return '';
    if (input.startsWith('http://') || input.startsWith('https://')) return input;
    const username = input.startsWith('@') ? input.slice(1) : input;
    return `https://instagram.com/${username}`;
  };

  const items = [
    { key: 'instagram', url: getInstagramUrl(safeLinks.instagram), Icon: InstagramColorIcon, label: 'Instagram' },
  ].filter((i) => !!safeLinks.instagram); // Filter check original input to avoid empty links for empty strings

  if (!items.length) return null;

  return (
    <div className="flex items-center gap-2">
      {items.map(({ key, url, Icon, label }) => {
        const IconComponent = Icon;
        return (
          <a
            key={key}
            href={url}
            target={url?.startsWith('mailto:') ? '_self' : '_blank'}
            rel={url?.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className={[
              'inline-flex items-center justify-center rounded-md transition-colors',
              'hover:bg-gray-100', // Subtle hover
              size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-2.5' : 'p-2'
            ].join(' ')}
            aria-label={label}
            onClick={(e) => e.stopPropagation()}
          >
            <IconComponent className={iconSize(size)} aria-hidden="true" />
            {variant === 'text' && <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
