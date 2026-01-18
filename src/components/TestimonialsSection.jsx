import { useEffect, useState } from 'react';
import 'flyonui/flyonui';
import { GraduationCap, ShieldCheck, Crown, ArrowLeft, ArrowRight } from 'lucide-react';
import { apiFetch } from '../services/api.js';
import EmptyState from './EmptyState';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const json = await apiFetch('/public/testimonials', { method: 'GET', skipAuth: true });
        const items = json?.data?.items || json?.data || [];
        if (alive) setTestimonials(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!alive) return;
        if (e?.status !== 404) console.error('Failed to load testimonials:', e);
        setTestimonials([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const RoleIcon = ({ role, size = 18 }) => {
    const r = role.toLowerCase();
    if (r.includes('ketua')) return <Crown size={size} />;
    if (r.includes('pembina')) return <ShieldCheck size={size} />;
    if (r.includes('alumni')) return <GraduationCap size={size} />;
    return <ShieldCheck size={size} />;
  };

  useEffect(() => {
    if (!window.__flyonui_loaded) {
      import('flyonui/flyonui')
        .then(() => {
          window.__flyonui_loaded = true;
        })
        .catch(console.error);
    }
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="py-8 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div id="multi-slide" data-carousel='{"loadingClasses":"opacity-0","slidesQty":{"xs":1,"md":2}}' className="relative flex w-full gap-12 max-lg:flex-col md:gap-16 lg:items-center lg:gap-24">
            <div>
              <div className="space-y-4">
                <p className="inline-block text-primary-500 text-sm font-medium bg-primary-50 p-2 rounded-xl">Pengalaman Alumni</p>
                <h2 className="text-neutral-800 text-2xl font-semibold md:text-3xl lg:text-4xl">Bagaimana Pendapat Alumni GenBI Unsika</h2>
                <p className="text-neutral-500 text-xl">Yuk, cari tahu bagaimana pengalaman alumni selama menjadi anggota GenBI Unsika.</p>
              </div>

              {/* Tombol navigasi tetap berfungsi & tidak overlay heading */}
              <div className="mt-10 flex gap-4">
                <button
                  type="button"
                  aria-label="Sebelumnya"
                  className="
                    carousel-prev relative
                    flex items-center justify-center
                    w-9 h-9 rounded-md
                    bg-primary-300 text-white
                    hover:bg-primary-500
                    carousel-disabled:opacity-50 carousel-disabled:cursor-not-allowed
                    transition-colors duration-200
                  "
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  aria-label="Berikutnya"
                  className="
                    carousel-next relative
                    flex items-center justify-center
                    w-9 h-9 rounded-md
                    bg-primary-400 text-white
                    hover:bg-primary-600
                    carousel-disabled:opacity-50 carousel-disabled:cursor-not-allowed
                    transition-colors duration-200
                  "
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Carousel */}
            <div className="carousel rounded-box p-8 overflow-hidden">
              {loading ? (
                <div className="text-gray-500 py-8">Memuat testimoni...</div>
              ) : testimonials.length === 0 ? (
                <div className="py-8">
                  <EmptyState icon="users" title="Belum ada testimoni" description="Testimoni dari anggota akan muncul di sini." />
                </div>
              ) : (
                <div className="carousel-body gap-2 opacity-0">
                  {testimonials.map((item, idx) => (
                    <div className="carousel-slide" key={idx}>
                      <div
                        className="
                        relative cursor-pointer rounded-3xl border border-neutral-200 bg-white
                        transition-transform duration-300 ease-out
                        hover:-translate-y-1 hover:scale-[1.03]
                        focus:outline-none focus-visible:outline-none hover:ring-primary-300 hover:ring-offset-0
                        w-60 sm:w-64 md:w-64 lg:w-72
                        h-54 md:h-80
                        shadow-sm-primary-500/30 hover:shadow-lg-primary-500/30
                      "
                        tabIndex={0}
                      >
                        <div className="card-body gap-4 flex flex-col justify-between">
                          <div className="flex flex-col justify-center items-center gap-3">
                            <div className="avatar">
                              <div className="size-14 rounded-full">
                                <img src={item.photo_profile} alt={item.name} loading="lazy" />
                              </div>
                            </div>
                            <h4 className="text-neutral-800 font-medium">{item.name}</h4>
                            <p className="text-neutral-600 text-sm">{item.role}</p>
                          </div>
                          <p className="text-neutral-700 text-reguler overflow-hidden text-center">{item.quote}</p>
                        </div>

                        {/* Accent bar bawah */}
                        <div
                          className="
        absolute inset-x-0 bottom-0 h-1 bg-primary-500
        origin-left scale-x-0 group-hover:scale-x-100
        transition-transform duration-300
      "
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* End Carousel */}
          </div>
        </div>
      </div>
    </section>
  );
}
