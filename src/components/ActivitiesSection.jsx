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
    <ScrollReveal as="section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Activities */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary-500 mb-6">Aktivitas</h2>

          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap mb-8">
            <h3 className="text-xl font-semibold text-neutral-800">Yuk, Ikuti Event Kami</h3>
            <a href="/events" className="text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap">
              Lihat Semua →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? <div className="text-gray-500">Memuat...</div> : null}
            {!loading && activities.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon="calendar" title="Belum ada event" description="Event terbaru akan muncul di sini" variant="primary" />
              </div>
            ) : null}
            {activities.map((a, idx) => (
              <ScrollReveal key={a.id || a.slug || a.title} as="div" once className="h-full" delayMs={idx * 70}>
                <EventCard title={a.title} {...a} to={a.href || (a.id ? `/events/${a.id}` : '/events')} />
              </ScrollReveal>
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
            {loading ? <div className="text-gray-500">Memuat...</div> : null}
            {!loading && projects.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon="clipboard" title="Belum ada proker" description="Program kerja akan muncul di sini" variant="primary" />
              </div>
            ) : null}
            {projects.map((p, idx) => (
              <ScrollReveal key={p.id || p.slug || p.title} as="div" once className="h-full" delayMs={idx * 70}>
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
