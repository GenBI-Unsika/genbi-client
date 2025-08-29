import { useState } from 'react'

const ActivitiesPage = () => {
  const [activeTab, setActiveTab] = useState('beasiswa')

  const scholarshipData = [
    {
      id: 1,
      title: 'Beasiswa Bank Indonesia - Universitas Singaperbangsa Karawang',
      period: 'Periode 2024',
      status: 'Sedang Mendaftar',
      statusColor: 'bg-yellow-100 text-yellow-800',
      logo: '/placeholder.svg?key=54t3w'
    }
  ]

  const eventData = [
    {
      id: 1,
      title: 'Webinar Nasional GENSPARK | Strategic Planning And Soft Skills For Career Growth',
      location: 'Online',
      date: 'Sabtu, 11 Mei 2024',
      status: 'Terdaftar',
      statusColor: 'bg-green-100 text-green-800',
      image: '/placeholder.svg?key=b7w4n'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Riwayat Aktivitas</h2>
      
      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('beasiswa')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'beasiswa'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Beasiswa
        </button>
        <button
          onClick={() => setActiveTab('event')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'event'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Event
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'beasiswa' && (
          <>
            {scholarshipData.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-6 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img src={item.logo || "/placeholder.svg"} alt="Logo" className="w-12 h-12 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.period}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'event' && (
          <>
            {eventData.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-6 border border-gray-200 rounded-lg">
                <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={item.image || "/placeholder.svg"} alt="Event" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.location} | {item.date}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default ActivitiesPage
