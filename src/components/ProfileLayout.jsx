'use client';

import { useState } from 'react';
import { getMe } from '../utils/auth.js';
import { useConfirm } from '../contexts/ConfirmContext.jsx';
import { ProfileIcon, HistoryIcon, SettingsIcon, LogoutIcon } from './icons/CustomIcons.jsx';

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
      icon: <ProfileIcon className="w-5 h-5" />,
    },
    {
      id: 'activity-history',
      label: 'Riwayat Aktivitas',
      icon: <HistoryIcon className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: <SettingsIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-center gap-4">
          <img src={userAvatar} alt={userName} className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-primary-100 bg-primary-50" referrerPolicy="no-referrer" />
          <div className="text-center sm:text-left">
            <h1 className="text-h2 font-bold text-gray-900 mb-1">Halo, {userName}</h1>
            <p className="text-body text-gray-600">Berikut informasi mengenai profil dan aktivitas kamu</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-transparent lg:bg-white rounded-lg lg:shadow-sm lg:border border-gray-200 overflow-hidden">
              <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-3 lg:gap-0 p-1 lg:p-0 scrollbar-hide">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`
                      flex items-center px-4 py-2 lg:px-6 lg:py-4 text-left whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:w-full transition-all duration-200
                      rounded-full lg:rounded-none border lg:border-0
                      ${activeTab === item.id
                        ? 'bg-primary-600 text-white shadow-md lg:shadow-none border-primary-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 lg:hover:bg-gray-50 hover:translate-x-0 lg:hover:translate-x-1'
                      }
                    `}
                  >
                    <span className={`mr-2 lg:mr-3 ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>{item.icon}</span>
                    <span className="font-medium text-sm lg:text-base">{item.label}</span>
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 lg:px-6 lg:py-4 text-left text-red-600 lg:text-gray-700 bg-white lg:bg-transparent border border-red-100 lg:border-0 rounded-full lg:rounded-none hover:bg-red-50 lg:hover:bg-gray-50 transition-all duration-200 lg:hover:translate-x-1 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:w-full"
                >
                  <span className="mr-2 lg:mr-3 text-red-500 lg:text-gray-500">
                    <LogoutIcon className="w-5 h-5" />
                  </span>
                  <span className="font-medium text-sm lg:text-base">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 min-h-[600px]">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
