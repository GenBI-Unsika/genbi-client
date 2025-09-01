import { MapPin, Calendar, Clock } from 'lucide-react';
import MediaPlaceholder from '../components/shared/MediaPlaceholder';

const EventDetailPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="mb-8">
          <MediaPlaceholder ratio="16/9" label="Poster Event" icon="camera" className="rounded-lg" />
        </div>

        {/* Event Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 transform hover:shadow-lg transition-shadow duration-300">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Nama Event</h1>

          <p className="text-gray-700 leading-relaxed mb-8">
            Lorem ipsum dolor sit amet consectetur. Hac et pharetra ante tellus et consectetur est at dignissim. Ultrices ac lectus lectus eu ipsum mattis ut vestibulum. Metus leo turpis duis praesent a dignissim. Ut fermentum id facilisis
            quis.
          </p>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <MapPin className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Lokasi</p>
                <p className="font-medium text-gray-900">Place</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Tanggal</p>
                <p className="font-medium text-gray-900">Date</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Waktu</p>
                <p className="font-medium text-gray-900">Time</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Benefit :</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• benefit 1</li>
              <li>• benefit 2</li>
              <li>• benefit 3</li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button onClick={() => onNavigate('event-registration')} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
              Daftar Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
