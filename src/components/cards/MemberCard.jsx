import SocialLinks from '../shared/SocialLinks';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'GN';

const MemberCard = ({ member = {}, onClick, showStudyInfo = true }) => {
  const { name, jabatan, position, photo, image, socials, socialMedia, major, faculty } = member;
  const displayJabatan = jabatan || position;
  const displayPhoto = photo || image;
  const displaySocials = socials || socialMedia;

  const badgeText = member.divisionTitle || member.division; // ← pakai division langsung

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(member);
    }
  };

  return (
    <div
      {...(onClick ? { role: 'button', tabIndex: 0, onClick: () => onClick(member), onKeyDown } : {})}
      className={[
        'group w-full text-left bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm',
        onClick
          ? 'transform-gpu transition-transform duration-200 ease-out cursor-pointer hover:scale-[1.02] hover:shadow-xl-primary-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2'
          : '',
      ].join(' ')}
    >
      {/* Media */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {displayPhoto ? (
          <img
            src={displayPhoto}
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

        {/* {badgeText && <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-medium px-2 py-1 rounded-md">{badgeText}</span>} */}
      </div>

      <div className="flex justify-between">
        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{name}</h3>
          <p className="text-gray-600 text-sm line-clamp-1">{displayJabatan}</p>

        </div>
        {/* Socials */}
        <div className="mt-3 pr-4 opacity-100 sm:opacity-90 sm:group-hover:opacity-100 transition-opacity">
          <SocialLinks links={displaySocials} size="sm" />
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
