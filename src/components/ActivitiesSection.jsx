import EventCard from '../components/cards/EventCard';
import ProkerCard from '../components/cards/ProkerCard';

const ActivitiesSection = () => {
  const activities = [
    { title: 'CEO EXPO 2024', subtitle: 'Seminar Bisnis dan Kewirausahaan', image: 'https://placehold.co/800x450', category: 'Event', date: '2024-11-10', href: '/events/ceo-expo-2024' },
    { title: 'GENSPARK', subtitle: 'Workshop Pengembangan Kepemimpinan', image: 'https://placehold.co/800x450', category: 'Workshop', date: '2024-12-02', href: '/events/genspark' },
    { title: 'GENBI DONOR DARAH', subtitle: 'Kegiatan Sosial Donor Darah', image: 'https://placehold.co/800x450', category: 'Sosial', date: '2024-12-15', href: '/events/donor-darah' },
    { title: 'GERMAS', subtitle: 'Gerakan Masyarakat Hidup Sehat', image: 'https://placehold.co/800x450', category: 'Kesehatan', date: '2025-01-05', href: '/events/germas' },
  ];

  const projects = [
    { title: 'Bisnis Produk Kreatif', subtitle: 'Program Kewirausahaan', image: 'https://placehold.co/800x450', category: 'Kewirausahaan', date: '2025-02-10', href: '/proker/bisnis-produk-kreatif' },
    { title: 'Bersih Sampah - Edisi Lingkungan Sehat', subtitle: 'Program Lingkungan', image: 'https://placehold.co/800x450', category: 'Lingkungan', date: '2025-03-02', href: '/proker/bersih-sampah' },
    { title: 'Seminar Motivasi - Edisi Pendidikan', subtitle: 'Program Edukasi', image: 'https://placehold.co/800x450', category: 'Edukasi', date: '2025-03-15', href: '/proker/seminar-motivasi' },
    { title: 'Kajian Ekonomi Syariah', subtitle: 'Program Kajian', image: 'https://placehold.co/800x450', category: 'Kajian', date: '2025-04-05', href: '/proker/kajian-ekonomi-syariah' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Activities */}
        <div className="mb-16">
          <h2 className="text-4xl font-semibold text-primary-500 mb-6">Aktivitas</h2>

          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap mb-8">
            <h3 className="text-xl font-semibold text-neutral-800">Yuk, Ikuti Event Kami</h3>
            <a href="/events" className="text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap">
              Lihat Semua →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((a, i) => (
              <EventCard key={i} {...a} />
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold text-neutral-800">Proker Kami</h3>
            <a href="/proker" className="text-primary-600 hover:text-primary-700 font-medium">
              Lihat Semua →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((p, i) => (
              <ProkerCard key={i} {...p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
