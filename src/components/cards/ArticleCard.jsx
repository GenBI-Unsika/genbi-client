import PropTypes from 'prop-types';
import { Clock } from 'lucide-react';
import { CalendarIcon, ArrowRightIcon } from '../icons/CustomIcons.jsx';
import { Link } from 'react-router-dom';
import MediaPlaceholder from '../shared/MediaPlaceholder';
import { normalizeFileUrl } from '../../utils/api';
import { formatDateID, stripHtml } from '../../utils/formatters';

const ArticleCard = ({ title, excerpt, image, coverImage, date, readTime, badge, badgeColor, href, to, placeholder = null, className = '' }) => {
  const Wrapper = to ? Link : href ? 'a' : 'div';
  const wrapperProps = to ? { to } : href ? { href } : {};

  const badgeLabel = typeof badge === 'string' ? badge : badge && typeof badge === 'object' ? badge.name || badge.title || badge.label || '' : '';

  const imageUrl = normalizeFileUrl(image || coverImage);

  const Card = (
    <article
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col transform-gpu transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <div className="relative">
        <div className="w-full aspect-[16/10] bg-gray-100 overflow-hidden">
          <div className="absolute inset-0">
            <MediaPlaceholder ratio="16/10" label="Tidak ada cover" className="h-full w-full rounded-none border-0 hover:scale-100 hover:shadow-none transition-none" />
          </div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transform-gpu transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
        </div>
        {badgeLabel && (
          <span
            className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-md leading-none shadow-sm"
            style={{
              backgroundColor: badgeColor ? `${badgeColor}25` : '#E3EEFC',
              color: badgeColor || '#01319F',
              border: badgeColor ? `1px solid ${badgeColor}40` : 'none',
            }}
          >
            {badgeLabel}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2">
        <h4 className="card-title mb-1 leading-snug line-clamp-2">{title}</h4>
        {excerpt && <p className="text-body-sm text-gray-600 mb-3 line-clamp-2">{stripHtml(excerpt)}</p>}

        <div className="mt-0.5 flex items-center gap-3 meta-text">
          {date && (
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              {formatDateID(date)}
            </span>
          )}
          {readTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTime}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <span className="w-full inline-flex items-center justify-center bg-[#F3F5F9] text-[#01319F] text-btn rounded-lg px-3 py-2 group">
            <span className="group-hover:underline">Baca selengkapnya</span>
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
    </article>
  );

  if (to) {
    return (
      <Link to={to} className="block focus:outline-none focus:ring-2 focus:ring-primary-300">
        {Card}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className="block focus:outline-none focus:ring-2 focus:ring-primary-300">
        {Card}
      </a>
    );
  }

  return Card;
};

ArticleCard.propTypes = {
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  image: PropTypes.string,
  coverImage: PropTypes.string,
  date: PropTypes.string,
  readTime: PropTypes.string,
  badge: PropTypes.string,
  badgeColor: PropTypes.string,
  href: PropTypes.string,
  to: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default ArticleCard;
