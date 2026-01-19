'use client';

import { useState } from 'react';
import { getMe } from '../utils/auth.js';
import { useConfirm } from '../contexts/ConfirmContext.jsx';

const ProfileLayout = ({ children, currentPage, onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState(currentPage);
  const { confirm } = useConfirm();
  const user = getMe();
  const userName = user?.profile?.name || user?.email?.split('@')[0] || 'Pengguna';
  const userAvatar = user?.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=128`;

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Logout?',
      description: 'Anda akan keluar dari akun ini.',
      confirmText: 'Ya, logout',
      cancelText: 'Batal',
      tone: 'danger',
    });

    if (!ok) return;
    await onLogout?.();
  };

  const handleNavigation = (page) => {
    setActiveTab(page);
    onNavigate(page);
  };

  const menuItems = [
    {
      id: 'profile',
      label: 'Profil Saya',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'activity-history',
      label: 'Riwayat Aktivitas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'transactions',
      label: 'Transaksi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 flex items-center gap-4">
          <img src={userAvatar} alt={userName} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Halo, {userName}</h1>
            <p className="text-gray-600">Berikut informasi mengenai profil dan aktivitas kamu</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center px-6 py-4 text-left transition-colors ${activeTab === item.id ? 'bg-primary-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}

                {/* Logout Button */}
                <button onClick={handleLogout} className="w-full flex items-center px-6 py-4 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 min-h-[600px]">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
