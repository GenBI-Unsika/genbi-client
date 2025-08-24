const ActivitiesSection = () => {
  const activities = [
    {
      title: "CEO EXPO 2024",
      subtitle: "Seminar Bisnis dan Kewirausahaan",
      image: "/business-seminar-event.png",
      category: "Event",
    },
    {
      title: "GENSPARK",
      subtitle: "Workshop Pengembangan Kepemimpinan",
      image: "/leadership-workshop.png",
      category: "Workshop",
    },
    {
      title: "GENBI DONOR DARAH",
      subtitle: "Kegiatan Sosial Donor Darah",
      image: "/blood-donation-event.png",
      category: "Sosial",
    },
    {
      title: "GERMAS",
      subtitle: "Gerakan Masyarakat Hidup Sehat",
      image: "/healthy-lifestyle-campaign.png",
      category: "Kesehatan",
    },
  ]

  const projects = [
    {
      title: "Bisnis Produk Kreatif",
      subtitle: "Program Kewirausahaan",
      image: "/creative-business-products.png",
    },
    {
      title: "Bersih Sampah - Edisi Lingkungan Sehat",
      subtitle: "Program Lingkungan",
      image: "/environmental-cleanup-activity.png",
    },
    {
      title: "Seminar Motivasi - Edisi Pendidikan",
      subtitle: "Program Edukasi",
      image: "/motivational-seminar-education.png",
    },
    {
      title: "Kajian Ekonomi Syariah",
      subtitle: "Program Kajian",
      image: "/islamic-economics-discussion.png",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Activities */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary-900">Aktivitas</h2>
            <button className="text-primary-500 hover:text-primary-600 font-medium">Lihat Lainnya →</button>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-6">Yu, Ikuti Event Kami</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <span className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full mb-2">
                    {activity.category}
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold text-gray-800">Proker Kami</h3>
            <button className="text-primary-500 hover:text-primary-600 font-medium">Lihat Lainnya →</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{project.title}</h4>
                  <p className="text-sm text-gray-600">{project.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ActivitiesSection
