import React from "react";

const TeamsPage = () => {
  const members = [
    { name: "Wardatul A.", jabatan: "Ketua Umum" },
    { name: "M. Fiqri Ferdinan", jabatan: "Wakil Ketua" },
    { name: "Muhammad Wildan", jabatan: "Sekretaris Umum" },
    { name: "Ragil Ohat Dirganti", jabatan: "Bendahara Umum" },
    { name: "Laili Annisyah D.", jabatan: "Koordinator Wilayah" },
    { name: "Sheny Ardrianah", jabatan: "Koordinator Program" },
    { name: "Luthfei Arikinasari", jabatan: "Koordinator Keuangan" },
    { name: "Stevani Lathania", jabatan: "Koordinator Administrasi" },
    { name: "Ilham Deikhsa", jabatan: "Kepala Divisi" },
    { name: "Sari Rahel Sihoina", jabatan: "Wakil Kepala Divisi" },
    { name: "Vitriyana Br Simeangkir", jabatan: "Staff Divisi" },
    { name: "Seto Dwi Pranowo", jabatan: "Staff Divisi" },
    { name: "Aliansin Oktavianti", jabatan: "Staff Divisi" },
    { name: "Nensi Agustina Tarigan", jabatan: "Staff Divisi" },
    { name: "Nabil Khafidz", jabatan: "Staff Divisi" },
    { name: "Nadia Rasi Marlissa", jabatan: "Staff Divisi" },
    { name: "M Faizal Wahidatuddin", jabatan: "Kepala Divisi" },
    { name: "Mega Belliana Utami", jabatan: "Wakil Kepala Divisi" },
    { name: "Milhan Kuzin", jabatan: "Staff Divisi" },
    { name: "Anisya Chairunnisa", jabatan: "Staff Divisi" },
    { name: "Nadira Rahel Putri", jabatan: "Staff Divisi" },
    { name: "Fayha Sabrina", jabatan: "Staff Divisi" },
    { name: "Najwa Maulida Ashshhfa", jabatan: "Staff Divisi" },
    { name: "Nova Marisa Siregar", jabatan: "Staff Divisi" },
    { name: "Reni Rahmania", jabatan: "Kepala Divisi" },
    { name: "Anindra Putri Bela T", jabatan: "Wakil Kepala Divisi" },
    { name: "Larasatila Rahadilia", jabatan: "Staff Divisi" },
    { name: "Angel Aurellia Aqeela", jabatan: "Staff Divisi" },
    { name: "Deryan A F A", jabatan: "Staff Divisi" },
    { name: "Farza Humaiza", jabatan: "Staff Divisi" },
    { name: "Bentantius M R", jabatan: "Staff Divisi" },
    { name: "Maulidul Khoi Z", jabatan: "Staff Divisi" },
  ];

  const divisions = [
    { title: "Steering Committee", count: 8 },
    { title: "Divisi Pengembangan Masyarakat", count: 8 },
    { title: "Divisi Komunikasi", count: 8 },
    { title: "Divisi Riset/Isu", count: 8 },
    { title: "Divisi Kewirausahaan", count: 8 },
    { title: "Divisi Pendidikan", count: 8 },
  ];

  const MemberCard = ({ member }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full mx-auto mb-2 flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="w-16 h-2 bg-white bg-opacity-50 rounded mx-auto mb-1"></div>
          <div className="w-12 h-2 bg-white bg-opacity-30 rounded mx-auto"></div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">
          {member.name}
        </h3>
        <p className="text-gray-600 text-sm">{member.jabatan}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Anggota GenBI Unsika
          </h1>
          <p className="text-gray-600 text-lg">
            Yuk, kenal lebih dekat dengan kami
          </p>
        </div>

        {/* Divisions */}
        {divisions.map((division, divIndex) => {
          const startIndex = divIndex * division.count;
          const divisionMembers = members.slice(
            startIndex,
            startIndex + division.count
          );

          return (
            <div key={division.title} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {division.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {divisionMembers.map((member, index) => (
                  <MemberCard key={index} member={member} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamsPage;
