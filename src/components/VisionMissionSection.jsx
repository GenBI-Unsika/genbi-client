import { Brain, Zap, Share2, Sparkles } from 'lucide-react';

const VISION_MISSION_DATA = [
  {
    subtitle: 'Initiate',
    description: 'Menginisiasi beragam kegiatan yang memberdayakan masyarakat, berfokus pada peningkatan kualitas kesejahteraan dan kebutuhan.',
    icon: Brain,
    accentBg: 'bg-indigo-100',
    accentText: 'text-indigo-700',
  },
  {
    subtitle: 'Act',
    description:
      'Membuat program kerja yang menunjukkan kepedulian dan terlibat aktif melalui aksi konkret yang mendukung pemberdayaan sosial dan kebutuhan di masyarakat serta komunitas sesuai program divisi GenBI Unsika: pendidikan, Kesehatan masyarakat, lingkungan hidup, kewirausahaan, dan Kominfo, maupun kegiatan GenBI di luar komisariat UNSIKA',
    icon: Zap,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-700',
  },
  {
    subtitle: 'Share',
    description: 'Mendorong eksplorasi dan pengembangan potensi kreatif dan inovatif bagi komunitas dan program yang diberdayakan bisa berdampak berkelanjutan bagi masyarakat.',
    icon: Share2,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-700',
  },
  {
    subtitle: 'Inspire',
    description: 'Membagikan pengalaman inspirasi dan motivasi bagi lingkungan sekitar berupa kegiatan dokumentasi dan prestasi dari anggota komunitas GenBI UNSIKA sehingga membawa perubahan yang berkualitas.',
    icon: Sparkles,
    accentBg: 'bg-fuchsia-100',
    accentText: 'text-fuchsia-700',
  },
];

function MissionItem({ item }) {
  const Icon = item.icon;
  return (
    <li className="flex items-start gap-4 group">
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ring-1 ring-black/5 ${item.accentBg}`}>
        {/* Ikon dekoratif */}
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="flex-1">
        {item.subtitle && <h4 className={`text-lg font-semibold mb-2 ${item.accentText}`}>{item.subtitle}</h4>}
        <p className="text-gray-600 leading-relaxed">{item.description}</p>
      </div>
    </li>
  );
}

const VisionMissionSection = () => {
  return (
    <section aria-labelledby="vision-mission-heading" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h2 id="vision-mission-heading" className="text-3xl font-bold text-primary-500">
            Visi Misi GenBI Unsika
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ilustrasi Kiri */}
          <figure className="flex justify-center">
            <img src="https://placehold.co/800x600" alt="Ilustrasi kolaborasi tim" className="w-full h-auto rounded-2xl object-fit aspect-[4/3]" loading="lazy" decoding="async" width={800} height={600} />
          </figure>

          {/* Konten Kanan */}
          <div className="space-y-8">
            <div className="flex flex-col items-start space-y-4 mb-6">
              <h3 className="text-2xl font-semibold text-primary-900">Visi</h3>
              <p className="text-gray-600 leading-relaxed">Bersinergi mewujudkan komunitas GenBI UNSIKA yang dapat membawa perubahan positif, berkarakter, berintegritas, dan menjadi inspirasi bagi sekitar.</p>
            </div>

            <h3 className="text-2xl font-semibold text-primary-900 mb-6">Misi</h3>
            <ul className="space-y-6">
              {VISION_MISSION_DATA.map((item) => (
                <MissionItem key={item.subtitle || item.description.slice(0, 24)} item={item} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
