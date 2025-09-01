// pages/TeamsPage.jsx
import React, { useMemo, useState } from 'react';
import MemberCard from '../components/cards/MemberCard';
import Modal from '../components/ui/Modal';

const TeamsPage = () => {
  // ====== DATA ======
  const members = [
    { name: 'Wardatul A.', jabatan: 'Ketua Umum', photo: '', motivasi: 'Memberi dampak berarti melalui kolaborasi.', cerita: 'Berangkat dari komunitas kampus kecil hingga memimpin program nasional.' },
    { name: 'M. Fiqri Ferdinan', jabatan: 'Wakil Ketua' },
    { name: 'Muhammad Wildan', jabatan: 'Sekretaris Umum' },
    { name: 'Ragil Ohat Dirganti', jabatan: 'Bendahara Umum' },
    { name: 'Laili Annisyah D.', jabatan: 'Koordinator Wilayah' },
    { name: 'Sheny Ardrianah', jabatan: 'Koordinator Program' },
    { name: 'Luthfei Arikinasari', jabatan: 'Koordinator Keuangan' },
    { name: 'Stevani Lathania', jabatan: 'Koordinator Administrasi' },
    { name: 'Ilham Deikhsa', jabatan: 'Kepala Divisi' },
    { name: 'Sari Rahel Sihoina', jabatan: 'Wakil Kepala Divisi' },
    { name: 'Vitriyana Br Simeangkir', jabatan: 'Staff Divisi' },
    { name: 'Seto Dwi Pranowo', jabatan: 'Staff Divisi' },
    { name: 'Aliansin Oktavianti', jabatan: 'Staff Divisi' },
    { name: 'Nensi Agustina Tarigan', jabatan: 'Staff Divisi' },
    { name: 'Nabil Khafidz', jabatan: 'Staff Divisi' },
    { name: 'Nadia Rasi Marlissa', jabatan: 'Staff Divisi' },
    { name: 'M Faizal Wahidatuddin', jabatan: 'Kepala Divisi' },
    { name: 'Mega Belliana Utami', jabatan: 'Wakil Kepala Divisi' },
    { name: 'Milhan Kuzin', jabatan: 'Staff Divisi' },
    { name: 'Anisya Chairunnisa', jabatan: 'Staff Divisi' },
    { name: 'Nadira Rahel Putri', jabatan: 'Staff Divisi' },
    { name: 'Fayha Sabrina', jabatan: 'Staff Divisi' },
    { name: 'Najwa Maulida Ashshhfa', jabatan: 'Staff Divisi' },
    { name: 'Nova Marisa Siregar', jabatan: 'Staff Divisi' },
    { name: 'Reni Rahmania', jabatan: 'Kepala Divisi' },
    { name: 'Anindra Putri Bela T', jabatan: 'Wakil Kepala Divisi' },
    { name: 'Larasatila Rahadilia', jabatan: 'Staff Divisi' },
    { name: 'Angel Aurellia Aqeela', jabatan: 'Staff Divisi' },
    { name: 'Deryan A F A', jabatan: 'Staff Divisi' },
    { name: 'Farza Humaiza', jabatan: 'Staff Divisi' },
    { name: 'Bentantius M R', jabatan: 'Staff Divisi' },
    { name: 'Maulidul Khoi Z', jabatan: 'Staff Divisi' },
  ];

  const divisions = [
    { title: 'Steering Committee', count: 8 },
    { title: 'Divisi Pengembangan Masyarakat', count: 8 },
    { title: 'Divisi Komunikasi', count: 8 },
    { title: 'Divisi Riset/Isu', count: 8 },
    { title: 'Divisi Kewirausahaan', count: 8 },
    { title: 'Divisi Pendidikan', count: 8 },
  ];

  // hitung slice per divisi sekali saja
  const grouped = useMemo(() => {
    const arr = [];
    let cursor = 0;
    for (const d of divisions) {
      arr.push({
        title: d.title,
        members: members.slice(cursor, cursor + d.count),
      });
      cursor += d.count;
    }
    return arr;
  }, [divisions, members]);

  // ====== MODAL STATE ======
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

        {/* Divisions */}
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
          {/* Foto / Inisial */}
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
          </div>

          {/* Info */}
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500">Jabatan</p>
            <p className="font-medium text-gray-900 mb-4">{selected?.jabatan || '-'}</p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Motivasi</h4>
                <p className="text-gray-700">{selected?.motivasi || '—'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Cerita</h4>
                <p className="text-gray-700">{selected?.cerita || '—'}</p>
              </div>
            </div>

            {/* CTA opsional: kontak/medsos */}
            {/* <div className="mt-6 flex gap-3">
              <a href="#" className="px-3 py-2 rounded-lg bg-primary-600 text-white text-sm hover:bg-primary-700">
                Lihat Profil
              </a>
            </div> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamsPage;
