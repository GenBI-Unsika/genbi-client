import { Calendar } from 'lucide-react';

const ActivitiesSection = () => {
  const activities = [
    { title: 'CEO EXPO 2024', title2: 'CEO EXPO 2024', subtitle: 'Seminar Bisnis dan Kewirausahaan', image: 'https://placehold.co/800x450', category: 'Event', date: '2024-11-10' },
    { title: 'GENSPARK', subtitle: 'Workshop Pengembangan Kepemimpinan', image: 'https://placehold.co/800x450', category: 'Workshop', date: '2024-12-02' },
    { title: 'GENBI DONOR DARAH', subtitle: 'Kegiatan Sosial Donor Darah', image: 'https://placehold.co/800x450', category: 'Sosial', date: '2024-12-15' },
    { title: 'GERMAS', subtitle: 'Gerakan Masyarakat Hidup Sehat', image: 'https://placehold.co/800x450', category: 'Kesehatan', date: '2025-01-05' },
  ];

  const projects = [
    { title: 'Bisnis Produk Kreatif', subtitle: 'Program Kewirausahaan', image: 'https://placehold.co/800x450', category: 'Kewirausahaan', date: '2025-02-10' },
    { title: 'Bersih Sampah - Edisi Lingkungan Sehat', subtitle: 'Program Lingkungan', image: 'https://placehold.co/800x450', category: 'Lingkungan', date: '2025-03-02' },
    { title: 'Seminar Motivasi - Edisi Pendidikan', subtitle: 'Program Edukasi', image: 'https://placehold.co/800x450', category: 'Edukasi', date: '2025-03-15' },
    { title: 'Kajian Ekonomi Syariah', subtitle: 'Program Kajian', image: 'https://placehold.co/800x450', category: 'Kajian', date: '2025-04-05' },
  ];

  const gradient = 'from-[var(--primary-500)] to-[var(--primary-400)]';

  // --- Helpers ---
  const formatDateID = (iso) => {
    if (!iso) return 'TBA';
    const d = new Date(iso);
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Limit subtitle by words (fallback that doesn't require Tailwind line-clamp)
  const limitWords = (text, maxWords = 10) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '…';
  };

  // Tweak these if you want different limits per section
  const ACTIVITY_SUBTITLE_WORDS = 10;
  const PROJECT_SUBTITLE_WORDS = 10;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Activities */}
        <div className="mb-16">
          <h2 className="text-4xl font-semibold text-primary-500 mb-6">Aktivitas</h2>

          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap mb-8">
            <h3 className="text-xl font-semibold text-neutral-800">Yuk, Ikuti Event Kami</h3>
            <a href="#event" className="text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap">
              Lihat Semua →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((a, i) => (
              <article key={i} className="group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                {/* gambar konsisten */}
                <div className="relative w-full aspect-[16/9] bg-gray-100">
                  <img
                    src={a.image || '/placeholder.svg'}
                    alt={a.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/800x450';
                    }}
                  />
                </div>

                {/* konten + tanggal dipisah: tanggal bisa mt-auto untuk merapat ke bawah */}
                <div className={`p-4 bg-gradient-to-r ${gradient} text-white rounded-b-xl flex-1 flex flex-col`}>
                  {/* Block judul + subtitle */}
                  <div>
                    <span className="inline-flex w-fit items-center bg-white/15 text-white text-[11px] leading-none px-2 py-0.5 rounded-full mb-2 border border-white/25">{a.category}</span>
                    <h4 className="font-semibold text-white mb-1 leading-snug">{a.title}</h4>
                    <p className="text-sm text-white/85" title={a.subtitle}>
                      {limitWords(a.subtitle, ACTIVITY_SUBTITLE_WORDS)}
                    </p>
                  </div>

                  {/* tanggal acara */}
                  <div className="mt-auto pt-3 flex items-center gap-2 text-xs text-white/85">
                    <Calendar className="w-4 h-4 opacity-90" aria-hidden="true" />
                    <time dateTime={a.date}>{formatDateID(a.date)}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold text-neutral-800">Proker Kami</h3>
            <a href="#proker" className="text-primary-600 hover:text-primary-700 font-medium">
              Lihat Semua →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((p, i) => (
              <article key={i} className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="relative w-full aspect-[16/9] bg-gray-100">
                  <img
                    src={p.image || 'https://placehold.co/800x450'}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className={`p-4 bg-gradient-to-r ${gradient} text-white rounded-b-xl flex-1 flex flex-col`}>
                  <span className="inline-flex w-fit items-center bg-white/15 text-white text-[11px] leading-none px-2 py-0.5 rounded-full mb-2 border border-white/25">{p.category || 'Program'}</span>
                  <h4 className="font-semibold text-white mb-1 leading-snug">{p.title}</h4>
                  <p className="text-sm text-white/85" title={p.subtitle}>
                    {limitWords(p.subtitle, PROJECT_SUBTITLE_WORDS)}
                  </p>
                  <div className="mt-auto pt-3 flex items-center gap-2 text-xs text-white/85">
                    <Calendar className="w-4 h-4 opacity-90" aria-hidden="true" />
                    <time dateTime={p.date}>{formatDateID(p.date)}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
