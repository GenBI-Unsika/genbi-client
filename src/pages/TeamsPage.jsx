import { useMemo, useState } from 'react';
import MemberCard from '../components/cards/MemberCard';
import Modal from '../components/ui/Modal';
import SocialLinks from '../components/shared/SocialLinks';

const TeamsPage = () => {
  const members = useMemo(
    () => [
      // Steering Committee
      {
        name: 'Wardatul A.',
        jabatan: 'Ketua Umum',
        division: 'Steering Committee',
        photo: '',
        motivasi: 'Memberi dampak berarti melalui kolaborasi.',
        cerita: 'Berangkat dari komunitas kampus kecil hingga memimpin program nasional.',
        faculty: 'Ekonomi & Bisnis',
        major: 'Manajemen',
        cohort: 2022,
        socials: {
          instagram: 'https://instagram.com/wardatul',
          linkedin: 'https://www.linkedin.com/in/wardatul',
          twitter: 'https://twitter.com/wardatul',
          email: 'mailto:wardatul@example.com',
        },
      },
      {
        name: 'M. Fiqri Ferdinan',
        jabatan: 'Wakil Ketua',
        division: 'Steering Committee',
        photo: '',
        motivasi: 'Inovasi adalah kunci untuk masa depan yang lebih baik.',
        cerita: 'Aktif dalam berbagai proyek teknologi dan sosial sejak tahun pertama kuliah.',
        faculty: 'Teknik',
        major: 'Informatika',
        cohort: 2022,
        socials: {
          instagram: 'https://instagram.com/fiqri',
          linkedin: 'https://www.linkedin.com/in/mfiqri',
        },
      },
      {
        name: 'Muhammad Wildan',
        jabatan: 'Sekretaris Umum',
        division: 'Steering Committee',
        photo: '',
        faculty: 'Hukum',
        major: 'Ilmu Hukum',
        cohort: 2021,
        socials: {
          instagram: 'https://instagram.com/muhwildan',
          linkedin: 'https://www.linkedin.com/in/muhwildan',
        },
      },
      {
        name: 'Ragil Ohat Dirganti',
        jabatan: 'Bendahara Umum',
        division: 'Steering Committee',
        photo: '',
        faculty: 'Ekonomi & Bisnis',
        major: 'Akuntansi',
        cohort: 2021,
        socials: {
          instagram: 'https://instagram.com/ragilohat',
          linkedin: 'https://www.linkedin.com/in/ragilohat',
        },
      },

      // Divisi Pengembangan Masyarakat
      {
        name: 'Laili Annisyah D.',
        jabatan: 'Kepala Divisi',
        division: 'Divisi Pengembangan Masyarakat',
        photo: '',
        faculty: 'FKIP',
        major: 'Pendidikan Bahasa Inggris',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/lailiann' },
      },
      {
        name: 'Sheny Ardrianah',
        jabatan: 'Wakil Kepala Divisi',
        division: 'Divisi Pengembangan Masyarakat',
        photo: '',
        faculty: 'FKIP',
        major: 'PGSD',
        cohort: 2023,
        socials: { instagram: 'https://instagram.com/sheny' },
      },
      {
        name: 'Anisya Chairunnisa',
        jabatan: 'Staff Divisi',
        division: 'Divisi Pengembangan Masyarakat',
        photo: '',
        faculty: 'Ilmu Sosial & Politik',
        major: 'Sosiologi',
        cohort: 2023,
        socials: { instagram: 'https://instagram.com/anisya' },
      },
      {
        name: 'Nadira Rahel Putri',
        jabatan: 'Staff Divisi',
        division: 'Divisi Pengembangan Masyarakat',
        photo: '',
        faculty: 'Kesehatan Masyarakat',
        major: 'Ilmu Gizi',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/nadirarahel' },
      },

      // Divisi Komunikasi
      {
        name: 'Reni Rahmania',
        jabatan: 'Kepala Divisi',
        division: 'Divisi Komunikasi',
        photo: '',
        faculty: 'Ilmu Komunikasi',
        major: 'Public Relations',
        cohort: 2021,
        socials: { instagram: 'https://instagram.com/renirahma' },
      },
      {
        name: 'Anindra Putri Bela T',
        jabatan: 'Wakil Kepala Divisi',
        division: 'Divisi Komunikasi',
        photo: '',
        faculty: 'Desain Komunikasi Visual',
        major: 'Desain Grafis',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/anindraputri' },
      },
      {
        name: 'Luthfei Arikinasari',
        jabatan: 'Staff Ahli Keuangan',
        division: 'Divisi Komunikasi',
        photo: '',
        faculty: 'Ekonomi & Bisnis',
        major: 'Akuntansi',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/luthfei' },
      },
      {
        name: 'Stevani Lathania',
        jabatan: 'Staff Ahli Administrasi',
        division: 'Divisi Komunikasi',
        photo: '',
        faculty: 'Ilmu Sosial',
        major: 'Administrasi Publik',
        cohort: 2021,
        socials: { instagram: 'https://instagram.com/stevani' },
      },
      {
        name: 'Fayha Sabrina',
        jabatan: 'Staff Divisi',
        division: 'Divisi Komunikasi',
        photo: '',
        faculty: 'Ilmu Komunikasi',
        major: 'Jurnalistik',
        cohort: 2023,
        socials: { instagram: 'https://instagram.com/fayhasab' },
      },
      {
        name: 'Najwa Maulida Ashshhfa',
        jabatan: 'Staff Divisi',
        division: 'Divisi Komunikasi',
        photo: '',
        faculty: 'Ilmu Budaya',
        major: 'Sastra Indonesia',
        cohort: 2023,
        socials: { instagram: 'https://instagram.com/najwamaulida' },
      },

      // Divisi Riset/Isu
      {
        name: 'Ilham Deikhsa',
        jabatan: 'Kepala Divisi',
        division: 'Divisi Riset/Isu',
        photo: '',
        faculty: 'Sains & Teknologi',
        major: 'Statistika',
        cohort: 2021,
        socials: { instagram: 'https://instagram.com/ilhamdeik' },
      },
      {
        name: 'Sari Rahel Sihoina',
        jabatan: 'Wakil Kepala Divisi',
        division: 'Divisi Riset/Isu',
        photo: '',
        faculty: 'Sains & Teknologi',
        major: 'Statistika',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/sarirahel' },
      },
      {
        name: 'Nova Marisa Siregar',
        jabatan: 'Staff Divisi',
        division: 'Divisi Riset/Isu',
        photo: '',
        faculty: 'Teknik',
        major: 'Teknik Industri',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/novasiregar' },
      },
      {
        name: 'Larasatila Rahadilia',
        jabatan: 'Staff Divisi',
        division: 'Divisi Riset/Isu',
        photo: '',
        faculty: 'Hukum',
        major: 'Hukum Internasional',
        cohort: 2023,
        socials: { instagram: 'https://instagram.com/larasatila' },
      },

      // Divisi Kewirausahaan
      {
        name: 'Seto Dwi Pranowo',
        jabatan: 'Kepala Divisi',
        division: 'Divisi Kewirausahaan',
        photo: '',
        faculty: 'Ekonomi & Bisnis',
        major: 'Manajemen',
        cohort: 2023,
        socials: { instagram: 'https://instagram.com/setodwi' },
      },
      {
        name: 'Vitriyana Br Simeangkir',
        jabatan: 'Wakil Kepala Divisi',
        division: 'Divisi Kewirausahaan',
        photo: '',
        faculty: 'Ekonomi & Bisnis',
        major: 'Manajemen',
        cohort: 2023,
        socials: { instagram: 'https://instagram.com/vitriyana' },
      },
      {
        name: 'Angel Aurellia Aqeela',
        jabatan: 'Staff Divisi',
        division: 'Divisi Kewirausahaan',
        photo: '',
        faculty: 'Vokasi',
        major: 'Manajemen Pemasaran',
        cohort: 2023,
        socials: { instagram: 'https://instagram.com/angelaurellia' },
      },
      {
        name: 'Deryan A F A',
        jabatan: 'Staff Divisi',
        division: 'Divisi Kewirausahaan',
        photo: '',
        faculty: 'Ekonomi & Bisnis',
        major: 'Bisnis Digital',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/deryan' },
      },

      // Divisi Pendidikan
      {
        name: 'M Faizal Wahidatuddin',
        jabatan: 'Kepala Divisi',
        division: 'Divisi Pendidikan',
        photo: '',
        faculty: 'FKIP',
        major: 'Pendidikan Sejarah',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/faizalwahid' },
      },
      {
        name: 'Mega Belliana Utami',
        jabatan: 'Wakil Kepala Divisi',
        division: 'Divisi Pendidikan',
        photo: '',
        faculty: 'FKIP',
        major: 'Bimbingan Konseling',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/megabelliana' },
      },
      {
        name: 'Aliansin Oktavianti',
        jabatan: 'Staff Divisi',
        division: 'Divisi Pendidikan',
        photo: '',
        faculty: 'FKIP',
        major: 'Pendidikan Guru PAUD',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/aliansin' },
      },
      {
        name: 'Nensi Agustina Tarigan',
        jabatan: 'Staff Divisi',
        division: 'Divisi Pendidikan',
        photo: '',
        faculty: 'FKIP',
        major: 'Pendidikan Matematika',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/nensitarigan' },
      },
      {
        name: 'Nabil Khafidz',
        jabatan: 'Staff Divisi',
        division: 'Divisi Pendidikan',
        photo: '',
        faculty: 'FKIP',
        major: 'Pendidikan Jasmani',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/nabilkhafidz' },
      },
      {
        name: 'Nadia Rasi Marlissa',
        jabatan: 'Staff Divisi',
        division: 'Divisi Pendidikan',
        photo: '',
        faculty: 'FKIP',
        major: 'Pendidikan Bahasa Indonesia',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/nadiarasi' },
      },
      {
        name: 'Milhan Kuzin',
        jabatan: 'Staff Divisi',
        division: 'Divisi Pendidikan',
        photo: '',
        faculty: 'FKIP',
        major: 'Teknologi Pendidikan',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/milhankuzin' },
      },
      {
        name: 'Farza Humaiza',
        jabatan: 'Staff Divisi',
        division: 'Divisi Pendidikan',
        photo: '',
        faculty: 'Psikologi',
        major: 'Psikologi Pendidikan',
        cohort: 2023,
        socials: { instagram: 'https://instagram.com/farzahumaiza' },
      },
      {
        name: 'Bentantius M R',
        jabatan: 'Staff Divisi',
        division: 'Divisi Pendidikan',
        photo: '',
        faculty: 'FKIP',
        major: 'Pendidikan Fisika',
        cohort: 2021,
        socials: { instagram: 'https://instagram.com/bentantius' },
      },
      {
        name: 'Maulidul Khoi Z',
        jabatan: 'Staff Divisi',
        division: 'Divisi Pendidikan',
        photo: '',
        faculty: 'Sains & Teknologi',
        major: 'Kimia Murni',
        cohort: 2022,
        socials: { instagram: 'https://instagram.com/maulidulkhoi' },
      },
    ],
    []
  );

  useMemo(() => {
    const seen = new Set();
    members.forEach((m) => {
      const k = (m.name || '').trim().toLowerCase();
      if (seen.has(k)) console.warn('[TeamsPage] Duplikat nama:', m.name);
      seen.add(k);
    });
  }, [members]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const m of members) {
      const key = m.division || 'Lainnya';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(m);
    }
    return Array.from(map, ([title, list]) => ({ title, members: list }));
  }, [members]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleOpen = (member) => {
    setSelected(member);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Anggota GenBI Unsika</h1>
          <p className="text-gray-600 text-lg">Yuk, kenal lebih dekat dengan kami</p>
        </div>

        {/* Divisions (hasil grup otomatis) */}
        {grouped.map(({ title, members: list }) => (
          <section key={title} className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {list.map((m, i) => (
                <MemberCard key={`${title}-${i}`} member={m} onClick={handleOpen} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Modal Detail Anggota */}
      <Modal isOpen={open} onClose={handleClose} title={selected?.name || 'Detail Anggota'}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* FOTO + META (Jabatan, Divisi, Social) */}
          <div className="sm:col-span-1">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
              {selected?.photo ? (
                <img src={selected.photo} alt={`Foto ${selected.name}`} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 text-primary-900 grid place-items-center text-2xl font-semibold">
                    {(selected?.name || 'GN')
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((w) => w[0]?.toUpperCase())
                      .join('')}
                  </div>
                </div>
              )}
            </div>

            {/* Meta di bawah foto */}
            <div className="mt-4 space-y-3">
              <div className="text-xs inline-flex items-center gap-2 bg-gray-100 text-gray-700 rounded-md px-2 py-1 w-fit">
                <span className="font-medium">Divisi:</span>
                <span>{selected?.division || '—'}</span>
              </div>

              {/* Social links */}
              <SocialLinks links={selected?.socials} size="md" />
            </div>
          </div>

          {/* PROFIL + MOTIVASI */}
          <div className="sm:col-span-2">
            <div className="mb-4">
              <p className="text-xs text-gray-500">Jabatan</p>
              <p className="font-medium text-gray-900">{selected?.jabatan || '—'}</p>
            </div>
            {/* Profil ringkas */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900">Profil</h4>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-gray-500">Fakultas</p>
                  <p className="text-gray-800">{selected?.faculty || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jurusan/Prodi</p>
                  <p className="text-gray-800">{selected?.major || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Angkatan</p>
                  <p className="text-gray-800">{selected?.cohort ?? '—'}</p>
                </div>
              </div>
            </div>

            {/* Motivasi */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Motivasi</h4>
              <p className="text-gray-700">{selected?.motivasi || '—'}</p>
            </div>
          </div>

          {/* CERITA: full width di bawah */}
          <div className="sm:col-span-3">
            <h4 className="font-semibold text-gray-900">Cerita</h4>
            <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4 max-h-[50vh] overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-line">{selected?.cerita || '—'}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamsPage;
