import { useEffect, useMemo, useState } from 'react';
import MemberCard from '../components/cards/MemberCard';
import EmptyState from '../components/EmptyState';
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
      if (seen.has(k)) {  }
      seen.add(k);
    });
  }, [members]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const m of members) {
      const divisionLabel = m.divisionTitle || (typeof m.division === 'string' ? m.division : m.division && typeof m.division === 'object' ? m.division.name : '') || '';

      if (!divisionLabel) continue;

      if (!map.has(divisionLabel)) map.set(divisionLabel, []);
      map.get(divisionLabel).push(m);
    }
    return Array.from(map, ([title, list]) => ({ title, members: list }));
  }, [members]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="mb-12">
          <h1 className="page-title mb-4">Anggota GenBI Unsika</h1>
          <p className="section-subtitle">Yuk, kenal lebih dekat dengan kami</p>
        </div>

        {loading ? (
          <>
            {Array.from({ length: 2 }).map((_, divIdx) => (
              <section key={divIdx} className="mb-16 animate-pulse">
                <div className="h-7 w-40 bg-gray-200 rounded mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-3">
                      <div className="h-20 w-20 rounded-full bg-gray-200" />
                      <div className="h-4 w-28 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </>
        ) : null}
        {!loading && error ? <EmptyState icon="error" title="Gagal memuat anggota" description={error} variant="warning" /> : null}

        {!loading && !error ? (
          grouped.length === 0 ? (
            <div className="py-10">
              <EmptyState icon="users" title="Belum ada anggota" description="Data anggota GenBI Unsika akan tampil di sini ketika sudah tersedia." variant="default" />
            </div>
          ) : (
            grouped.map(({ title, members: list }) => (
              <section key={title} className="mb-16">
                <h2 className="section-title mb-8">{title}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
