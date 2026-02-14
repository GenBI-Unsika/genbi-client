import React from 'react';
import Modal from './ui/Modal';
import { useNavigate } from 'react-router-dom';

const CompleteProfileModal = ({ isOpen, onClose, missingFields = [] }) => {
  const navigate = useNavigate();

  const handleCompleteNow = () => {
    onClose();
    navigate('/profile');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lengkapi Profil Anda">
      <div className="flex flex-col gap-4">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-800 leading-relaxed">Halo! Sepertinya data profil kamu belum lengkap. Mohon lengkapi data berikut agar kamu bisa mengakses semua fitur GenBI.</p>
            </div>
          </div>
        </div>

        <div className="text-center py-6">
          <div className="w-32 h-32 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Data Diri Belum Lengkap</h4>
          <p className="text-gray-600 text-sm px-4 leading-relaxed">Demi kelancaran administrasi dan kegiatan, kami membutuhkan data diri kamu yang valid.</p>
        </div>

        <div className="flex flex-row justify-end gap-2 sm:gap-3 mt-2">
          <button onClick={onClose} className="px-3 py-2.5 sm:px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Nanti Saja
          </button>
          <button
            onClick={handleCompleteNow}
            className="px-3 py-2.5 sm:px-4 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm hover:shadow-md"
          >
            Lengkapi Sekarang
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CompleteProfileModal;
