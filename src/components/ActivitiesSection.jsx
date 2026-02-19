import EventCard from '../components/cards/EventCard';
import ProkerCard from '../components/cards/ProkerCard';
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api.js';
import EmptyState from './EmptyState';
import ScrollReveal from './ScrollReveal';

const ActivitiesSection = () => {
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [evt, prg] = await Promise.all([
          apiFetch('/public/events?limit=4', { method: 'GET', skipAuth: true }).catch((e) => (e?.status === 404 ? { data: [] } : Promise.reject(e))),
          apiFetch('/public/programs?limit=4', { method: 'GET', skipAuth: true }).catch((e) => (e?.status === 404 ? { data: [] } : Promise.reject(e))),
        ]);
        const evtItems = evt?.data?.items || evt?.data || [];
        const prgItems = prg?.data?.items || prg?.data || [];
        if (!alive) return;
        setActivities(Array.isArray(evtItems) ? evtItems : []);
        setProjects(Array.isArray(prgItems) ? prgItems : []);
      } catch {
        if (!alive) return;
        setActivities([]);
        setProjects([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <ScrollReveal as="section" className="py-14 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Activities */}
        <div className="mb-14 sm:mb-16">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-1">Aktivitas</p>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Yuk, Ikuti Event Kami</h2>
            </div>
            <a href="/events" className="text-sm text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap transition-colors duration-150 flex items-center gap-1 shrink-0">
              Lihat Semua <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-100 bg-white animate-pulse">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : null}
            {!loading && activities.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon="calendar" title="Belum ada event" description="Event terbaru akan muncul di sini" variant="primary" />
              </div>
            ) : null}
            {activities.map((a, idx) => (
              <ScrollReveal key={a.id || a.slug || a.title} as="div" once className="h-full" delay={(idx * 70) / 1000}>
                <EventCard title={a.title} {...a} to={a.href || (a.id ? `/events/${a.id}` : '/events')} />
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 my-2 mb-12 sm:mb-14" />

        {/* Projects */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-1">Program Kerja</p>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Proker Kami</h2>
            </div>
            <a href="/proker" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150 flex items-center gap-1 shrink-0">
              Lihat Semua <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-100 bg-white animate-pulse">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : null}
            {!loading && projects.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon="clipboard" title="Belum ada proker" description="Program kerja akan muncul di sini" variant="primary" />
              </div>
            ) : null}
            {projects.map((p, idx) => (
              <ScrollReveal key={p.id || p.slug || p.title} as="div" once className="h-full" delay={(idx * 70) / 1000}>
                <ProkerCard title={p.title} {...p} to={p.href || (p.id ? `/proker/${p.id}` : '/proker')} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ActivitiesSection;
