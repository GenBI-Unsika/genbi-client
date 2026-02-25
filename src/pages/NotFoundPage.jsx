import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';

const NotFoundPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Optional: adding noindex for SEO to prevent indexing of 404 pages
        let meta = document.querySelector('meta[name="robots"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'robots';
            meta.content = 'noindex, nofollow';
            document.head.appendChild(meta);
        } else {
            meta.content = 'noindex, nofollow';
        }

        return () => {
            // Clean up if we navigate away, but usually safe to leave or reset based on actual needs
            // If the app relies on default indexing, we probably should remove this meta tag when unmounting
            if (meta && meta.parentNode) {
                meta.parentNode.removeChild(meta);
            }
        };
    }, []);

    return (
        <PageTransition>
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
                <div className="mb-8 relative">
                    <div className="text-[120px] sm:text-[150px] font-bold text-gray-100 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 bg-white/80 px-4 rounded-xl backdrop-blur-sm">
                            Halaman Tidak Ditemukan
                        </span>
                    </div>
                </div>

                <p className="max-w-md mx-auto text-base sm:text-lg text-gray-600 mt-4 mb-8">
                    Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau sementara tidak tersedia.
                </p>

                <button
                    onClick={() => navigate('/', { replace: true })}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm transition-all duration-200"
                >
                    <Home className="w-5 h-5 mr-2" />
                    Kembali ke Beranda
                </button>
            </div>
            <Footer />
        </PageTransition>
    );
};

export default NotFoundPage;
