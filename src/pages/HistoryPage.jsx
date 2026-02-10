import React from 'react';

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sejarah GenBI Unsika</h1>
          <p className="text-gray-600 text-lg">Ketahui bagaimana GenBI Unsika dapat terbentuk hingga sekarang</p>
        </div>

        {/* Image Placeholder */}
        <div className="mb-8">
          <div className="w-full h-80 bg-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
              </div>
              <div className="w-20 h-3 bg-white bg-opacity-50 rounded mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed text-base mb-6">
            Genbi merupakan singkatan dari Generasi Baru Indonesia yaitu Komunitas Penerima Beasiswa Bank Indonesia. Genbi Unsika sendiri awal terbentuk pada Oktober 2018. Genbi Unsika sendiri masuk ke dalam Genbi Bandung Raya bersama
            dengan beberapa Universitas lainnya seperti UPI, ITB, Unpad, Ikopin, Uin Bandung, Unisba, Telkom-U, dan Unsika. Genbi Unsika terdiri dari 50 Anggota yang terbagi dalam 5 divisi yaitu pendidikan, kominfo, kewirausahaan, kesehatan
            masyarakat dan lingkungan hidup.
          </p>

          <div className="mt-8">
            <p className="text-gray-900 font-semibold">Genbi</p>
            <p className="text-gray-900 font-semibold">Energi Untuk Negeri!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
