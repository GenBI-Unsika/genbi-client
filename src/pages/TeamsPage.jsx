import { useEffect, useMemo, useState } from 'react';
import MemberCard from '../components/cards/MemberCard';
import EmptyStateImage from '../components/EmptyStateImage';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Modal from '../components/ui/Modal';
import SocialLinks from '../components/shared/SocialLinks';
import { apiFetch } from '../services/api.js';

const TeamsPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError('');
        setLoading(true);

        const json = await apiFetch('/teams', { method: 'GET', skipAuth: true });
        const items = json?.data || [];
        if (alive) setMembers(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!alive) return;
        // If endpoint isn't available yet (or no data), show empty-state instead of error.
        if (e?.status === 404) {
          setMembers([]);
          setError('');
          return;
        }

        setMembers([]);
        setError(e?.message || 'Gagal memuat data anggota');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
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

        {loading ? <LoadingSpinner text="Memuat anggota..." /> : null}
        {!loading && error ? <EmptyStateImage image="https://illustrations.popsy.co/amber/page-not-found.svg" imageAlt="Error loading members" title="Gagal memuat anggota" description={error} variant="primary" imageSize="lg" /> : null}

        {/* Divisions (hasil grup otomatis) */}
        {!loading && !error ? (
          grouped.length === 0 ? (
            <div className="py-10">
              <EmptyStateImage
                image="https://illustrations.popsy.co/amber/team-spirit.svg"
                imageAlt="No members illustration"
                title="Belum ada anggota"
                description="Data anggota GenBI Unsika akan tampil di sini ketika sudah tersedia."
                variant="primary"
                imageSize="lg"
              />
            </div>
          ) : (
            grouped.map(({ title, members: list }) => (
              <section key={title} className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {list.map((m, i) => (
                    <MemberCard key={`${title}-${i}`} member={m} onClick={handleOpen} />
                  ))}
                </div>
              </section>
            ))
          )
        ) : null}
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
