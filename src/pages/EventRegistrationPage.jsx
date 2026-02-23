import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { CalendarIcon } from '../components/icons/CustomIcons.jsx';
import toast from 'react-hot-toast';
import { apiFetch, apiPost, normalizeFileUrl } from '../services/api.js';
import { formatDateWithWeekday, formatDateTime } from '../utils/formatters';
import { getMe } from '../utils/auth.js';
import DOMPurify from 'dompurify';
import MediaPlaceholder from '../components/shared/MediaPlaceholder';
import { useSeo } from '../hooks/useSeo';

const EventRegistrationPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState(() => {
        const me = getMe();
        return {
            name: me?.profile?.name || '',
            email: me?.email || '',
            institution: '',
        };
    });

    useSeo({
        title: `Pendaftaran ${event?.title || 'Event'}`,
        description: `Formulir pendaftaran untuk ${event?.title}`,
    });

    useEffect(() => {
        if (!eventId) return;
        setLoading(true);
        apiFetch(`/activities/${eventId}`)
            .then((res) => {
                setEvent(res.data);
            })
            .catch((err) => {
                setError(err.message || 'Gagal memuat detail event');
            })
            .finally(() => setLoading(false));
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.institution) {
            toast.error('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setSubmitting(true);
        try {
            await apiPost(`/activities/${event.id}/registrations`, formData);
            setSuccess(true);
            toast.success('Pendaftaran berhasil!');
        } catch (err) {
            toast.error(err.message || 'Gagal mengirim pendaftaran');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Memuat formulir pendaftaran...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">{error || 'Event tidak ditemukan'}</p>
                    <button onClick={() => navigate('/events')} className="text-primary-600 hover:underline">
                        Kembali ke Daftar Event
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-neutral-200 text-center">
                    <div className="flex justify-center mb-6">
                        <svg className="w-20 h-20 text-green-500" viewBox="0 0 100 100">
                            <style>
                                {`
                                  .path {
                                    stroke-dasharray: 1000;
                                    stroke-dashoffset: 0;
                                  }
                                  .circle {
                                    animation: dash .9s ease-in-out;
                                  }
                                  .check {
                                    stroke-dashoffset: -100;
                                    animation: dash-check .9s .35s ease-in-out forwards;
                                  }
                                  @keyframes dash {
                                    0% { stroke-dashoffset: 1000; }
                                    100% { stroke-dashoffset: 0; }
                                  }
                                  @keyframes dash-check {
                                    0% { stroke-dashoffset: -100; }
                                    100% { stroke-dashoffset: 900; }
                                  }
                                `}
                            </style>
                            <circle className="path circle" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" cx="50" cy="50" r="40" />
                            <path className="path check" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" d="M30 50 l15 15 l25 -30" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
                    <p className="text-gray-600 mb-8">
                        Terima kasih telah mendaftar pada acara <strong>{event.title}</strong>. Informasi lebih lanjut akan dikirimkan melalui email yang telah Anda daftarkan.
                    </p>
                    <button
                        onClick={() => navigate('/events')}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    const dateStr = event.startDate ? formatDateWithWeekday(event.startDate) : '-';
    const timeStr = event.startDate ? formatDateTime(event.startDate).split(', ')[1] : '-';
    const benefits = event.benefits ? (typeof event.benefits === 'string' ? JSON.parse(event.benefits) : event.benefits) : [];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    <div>
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Detail Pendaftaran</h1>
                            <p className="text-lg text-gray-600">Lengkapi form berikut untuk mengikuti event kami</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Masukkan Nama Lengkap Anda"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Masukkan Email Aktif"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label htmlFor="institution" className="block text-sm font-bold text-gray-800 mb-2">
                                    Asal Instansi
                                </label>
                                <input
                                    type="text"
                                    id="institution"
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleChange}
                                    placeholder="Contoh: Universitas Singaperbangsa Karawang"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting || !formData.name || !formData.email || !formData.institution}
                                    className="w-full bg-[#CBD1D6] text-white hover:bg-primary-600 px-6 py-4 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                                    style={{
                                        backgroundColor: (formData.name && formData.email && formData.institution && !submitting) ? 'var(--primary-600)' : '#CBD1D6'
                                    }}
                                >
                                    {submitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                    ) : (
                                        'Daftar Sekarang'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:pl-8">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] p-6 md:p-8 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Detail Event</h3>

                            <div className="flex items-center gap-4 py-4 border-b border-gray-100 mb-6">
                                <div className="w-24 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                    {event.coverImage ? (
                                        <img src={normalizeFileUrl(event.coverImage)} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <MediaPlaceholder ratio="1" className="h-full w-full opacity-50" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 line-clamp-2 leading-snug">{event.title}</h4>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <span className="text-sm text-gray-600">{event.location || '-'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">{dateStr}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <span className="text-sm text-gray-600">{timeStr}</span>
                                </div>
                            </div>

                            {benefits.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-3 text-[15px]">Benefit :</h4>
                                    <ul className="space-y-2">
                                        {benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start text-sm text-gray-600">
                                                <span className="text-gray-400 mr-2 mt-0.5">•</span>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventRegistrationPage;
