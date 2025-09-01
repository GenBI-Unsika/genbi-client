import { useState } from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import MediaPlaceholder from '../components/shared/MediaPlaceholder';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 transform hover:shadow-lg transition-shadow duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Detail Pendaftaran</h1>
              <p className="text-gray-600 mb-8">Lengkapi form berikut untuk mengikuti event kami</p>

              <div className="space-y-6">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nama"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                {/* Asal Instansi */}
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

                {/* Submit Button */}
                <button onClick={handleSubmit} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg">
                  Daftar Sekarang
                </button>
              </div>
            </div>
          </div>

          {/* Event Details - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform hover:shadow-lg transition-shadow duration-300 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Detail Event</h2>

              {/* Event Image */}
              <div className="mb-6">
                <MediaPlaceholder ratio="16/9" label="Poster Event" icon="camera" />
                <p className="text-gray-900 font-medium mt-3">Nama Event</p>
              </div>

              {/* Event Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Place</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Date</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Time</span>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Benefit :</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Benefit 1</li>
                  <li>• Benefit 2</li>
                  <li>• Benefit 3</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
