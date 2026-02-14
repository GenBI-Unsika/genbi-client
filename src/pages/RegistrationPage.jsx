import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Loader2, CheckCircle } from 'lucide-react';
import MediaPlaceholder from '../components/shared/MediaPlaceholder';
import { apiFetch, apiPost, normalizeFileUrl } from '../utils/api';
import { formatDateLong, formatDateTime } from '../utils/formatters';

const RegistrationPage = ({ eventId }) => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    notes: '',
  });

  useEffect(() => {
    if (!eventId) {
      setError('Event ID tidak ditemukan');
      setLoading(false);
      return;
    }

    apiFetch(`/activities/${eventId}`)
      .then((res) => {
        setEvent(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load event:', err);
        setError(err.message || 'Gagal memuat event');
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Nama dan email wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      await apiPost(`/activities/${eventId}/registrations`, {
        ...formData,
        activityId: parseInt(eventId, 10),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit registration:', err);
      alert(err.message || 'Gagal mendaftarkan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="text-primary-600 hover:underline">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-h2 font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 mb-6">
            Terima kasih telah mendaftar untuk event <strong>{event?.title}</strong>. Kami akan mengirimkan informasi lebih lanjut ke email Anda.
          </p>
          <button onClick={() => navigate('/events')} className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium">
            Lihat Event Lainnya
          </button>
        </div>
      </div>
    );
  }

  const dateStr = event?.startDate ? formatDateLong(event.startDate) : '-';
  const timeStr = event?.startDate ? formatDateTime(event.startDate).split(', ')[1] : '-';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 transform hover:shadow-lg transition-shadow duration-300">
              <h1 className="text-h2 font-bold text-gray-900 mb-4">Detail Pendaftaran</h1>
              <p className="text-body text-gray-600 mb-8">
                Lengkapi form berikut untuk mengikuti event <strong>{event?.title}</strong>
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nama"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan Email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">No. Telepon/WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nomor Telepon"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Asal Instansi</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="Masukkan Asal Instansi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Catatan Tambahan</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ada pertanyaan atau catatan?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {submitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform hover:shadow-lg transition-shadow duration-300 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Detail Event</h2>

              <div className="mb-6">
                {event?.coverImage ? <img src={normalizeFileUrl(event.coverImage)} alt={event.title} className="w-full h-auto rounded-lg object-cover aspect-video" /> : <MediaPlaceholder ratio="16/9" label="Poster Event" icon="camera" />}
                <p className="text-gray-900 font-medium mt-3">{event?.title || 'Nama Event'}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{event?.location || '-'}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{dateStr}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{timeStr}</span>
                </div>
              </div>

              {event?.division && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Divisi:</span> {typeof event.division === 'string' ? event.division : event.division && typeof event.division === 'object' ? event.division.name : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
