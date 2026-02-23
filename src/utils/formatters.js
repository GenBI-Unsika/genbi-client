
export const formatDateID = (iso, options = {}) => {
  if (!iso) return 'TBA';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return 'TBA';

  const defaultOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  };

  return d.toLocaleDateString('id-ID', { ...defaultOptions, ...options });
};

export const formatDateLong = (iso) => {
  return formatDateID(iso, { month: 'long' });
};

export const formatDateWithWeekday = (iso) => {
  return formatDateID(iso, { weekday: 'long', month: 'long' });
};

export const formatDateTime = (iso) => {
  if (!iso) return 'TBA';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return 'TBA';

  const date = formatDateID(iso);
  const time = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });

  return `${date}, ${time} WIB`;
};

export const limitWords = (text, maxWords = 10) => {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ') + '…';
};

export const stripHtml = (html) => {
  if (!html) return '';
  if (typeof window !== 'undefined' && window.DOMParser) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
};
