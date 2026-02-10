import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ChevronLeft } from 'lucide-react';
import MediaPlaceholder from '../components/shared/MediaPlaceholder';
import ScrollReveal from '../components/ScrollReveal';
import { apiFetch } from '../services/api.js';
import { formatDateWithWeekday, formatDateTime } from '../utils/formatters';
import { normalizeFileUrl } from '../utils/api';

const EventDetailPage = ({ onNavigate, eventId }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) {
      setError('Event ID tidak ditemukan');
      setLoading(false);
      return;
    }

    setLoading(true);
    // Try activities endpoint first (activities are used for events/proker)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Event tidak ditemukan'}</p>
          <button onClick={() => onNavigate('home')} className="text-primary-600 hover:underline">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Format date and time
  const dateStr = event.startDate ? formatDateWithWeekday(event.startDate) : '-';
  const timeStr = event.startDate ? formatDateTime(event.startDate).split(', ')[1] : '-';

  // Parse benefits if stored as JSON
  const benefits = event.benefits ? (typeof event.benefits === 'string' ? JSON.parse(event.benefits) : event.benefits) : [];

  const divisionLabel = typeof event.division === 'string' ? event.division : event.division && typeof event.division === 'object' ? event.division.name : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="mb-8">
          {event.coverImage ? (
            <img src={normalizeFileUrl(event.coverImage)} alt={event.title} className="w-full h-auto rounded-lg object-cover max-h-96" />
          ) : (
            <MediaPlaceholder ratio="16/9" label="Poster Event" icon="camera" className="rounded-lg" />
          )}
        </div>

        {/* Event Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 mb-8 transform hover:shadow-lg transition-shadow duration-300">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{event.title}</h1>

          <p className="text-gray-700 leading-relaxed mb-8">{event.description || 'Deskripsi event akan ditampilkan di sini.'}</p>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <MapPin className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Lokasi</p>
                <p className="font-medium text-gray-900">{event.location || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Tanggal</p>
                <p className="font-medium text-gray-900">{dateStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Waktu</p>
                <p className="font-medium text-gray-900">{timeStr}</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          {benefits.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Benefit :</h3>
              <ul className="space-y-2 text-gray-700">
                {benefits.map((benefit, i) => (
                  <li key={i}>• {benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Division info */}
          {divisionLabel && (
            <div className="mb-8">
              <p className="text-sm text-gray-500">
                Divisi: <span className="font-medium text-gray-900">{divisionLabel}</span>
              </p>
            </div>
          )}

          {/* Status badge */}
          {event.status && (
            <div className="mb-8">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : event.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' : event.status === 'PLANNED' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {event.status === 'COMPLETED' ? 'Selesai' : event.status === 'ONGOING' ? 'Sedang Berlangsung' : event.status === 'PLANNED' ? 'Akan Datang' : event.status}
              </span>
            </div>
          )}

          {/* CTA Button */}
          {event.status !== 'COMPLETED' && (
            <div className="text-center">
              <button onClick={() => onNavigate('event-registration')} className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                Daftar Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
