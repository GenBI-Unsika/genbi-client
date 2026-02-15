import { useEffect, useMemo, useState } from 'react';
import MemberCard from '../components/cards/MemberCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/shared/LoadingSpinner';
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
      if (seen.has(k)) { /* skip */ }
      seen.add(k);
    });
  }, [members]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const m of members) {
      const divisionLabel = m.divisionTitle || (typeof m.division === 'string' ? m.division : m.division && typeof m.division === 'object' ? m.division.name : '') || '';

      // Skip members tanpa divisi
      if (!divisionLabel) continue;

      if (!map.has(divisionLabel)) map.set(divisionLabel, []);
      map.get(divisionLabel).push(m);
    }
    return Array.from(map, ([title, list]) => ({ title, members: list }));
  }, [members]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="page-title mb-4">Anggota GenBI Unsika</h1>
          <p className="section-subtitle">Yuk, kenal lebih dekat dengan kami</p>
        </div>

        {loading ? <LoadingSpinner text="Memuat anggota..." /> : null}
        {!loading && error ? <EmptyState icon="error" title="Gagal memuat anggota" description={error} variant="warning" /> : null}

        {/* Divisions (hasil grup otomatis) */}
        {!loading && !error ? (
          grouped.length === 0 ? (
            <div className="py-10">
              <EmptyState icon="users" title="Belum ada anggota" description="Data anggota GenBI Unsika akan tampil di sini ketika sudah tersedia." variant="default" />
            </div>
          ) : (
            grouped.map(({ title, members: list }) => (
              <section key={title} className="mb-16">
                <h2 className="section-title mb-8">{title}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {list.map((m, i) => (
                    <MemberCard key={`${title}-${i}`} member={m} />
                  ))}
                </div>
              </section>
            ))
          )
        ) : null}
      </div>
    </div>
  );
};

export default TeamsPage;
