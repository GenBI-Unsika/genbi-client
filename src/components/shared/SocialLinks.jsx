import { Instagram, Linkedin, Twitter, Globe, Mail } from 'lucide-react';

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

/**
 * props.links = {
 *   instagram?: 'https://instagram.com/...',
 *   linkedin?: 'https://linkedin.com/in/...',
 *   twitter?: 'https://twitter.com/...',
 *   website?: 'https://...',
 *   email?: 'mailto:...'
 * }
 */
const SocialLinks = ({ links = {}, size = 'md', variant = 'icons' }) => {
  const items = [
    { key: 'instagram', url: links.instagram, Icon: Instagram, label: 'Instagram' },
    { key: 'linkedin', url: links.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { key: 'twitter', url: links.twitter, Icon: Twitter, label: 'Twitter' },
    { key: 'website', url: links.website, Icon: Globe, label: 'Website' },
    { key: 'email', url: links.email, Icon: Mail, label: 'Email' },
  ].filter((i) => !!i.url);

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
            className={['inline-flex items-center justify-center rounded-md', 'text-gray-600 hover:text-primary-700', 'bg-gray-100 hover:bg-gray-200', 'transition-colors', size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-2.5' : 'p-2'].join(
              ' ',
            )}
            aria-label={label}
            // supaya klik icon tidak ikut buka modal parent
            onClick={(e) => e.stopPropagation()}
          >
            <IconComponent className={iconSize(size)} aria-hidden="true" />
            {variant === 'text' && <span className="ml-2 text-sm">{label}</span>}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
