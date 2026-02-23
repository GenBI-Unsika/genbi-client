import { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import { apiFetch } from '../services/api.js';

const defaultScholarshipContent = {
  title: 'Beasiswa Bank Indonesia',
  description:
    'Beasiswa Bank Indonesia merupakan beasiswa yang diberikan oleh Bank Indonesia bagi para mahasiswa S1 di berbagai Perguruan Tinggi Negeri (PTN). Para penerima beasiswa juga akan tergabung dalam organisasi bernama Generasi Baru Indonesia (GenBI) dan mendapatkan berbagai pelatihan untuk meningkatkan kompetensi, mengembangkan karakter dan jiwa kepemimpinan mereka. Ini merupakan komitmen Bank Indonesia (BI) untuk memajukan dunia pendidikan dan salah satu bentuk tanggung jawab sosial perusahaan. Adapaun tahap seleksi beasiswa Bank Indonesia terdiri dari 3 tahap.',
  buttonText: 'Daftar Sekarang',
  buttonUrl: '/scholarship/register',
  image: '',
};

const ScholarshipSection = () => {
  const [content, setContent] = useState(defaultScholarshipContent);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await apiFetch('/site-settings/cms_scholarship', { method: 'GET', skipAuth: true });
        const value = json?.data?.value;
        if (alive && value) {
          setContent({ ...defaultScholarshipContent, ...value });
        }
      } catch {
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleButtonClick = () => {
    if (content.buttonUrl) {
      window.location.href = content.buttonUrl;
    }
  };

  return (
    <ScrollReveal as="section" className="bg-white">

      <div className="py-12 sm:py-16 bg-primary-50 rounded-none md:rounded-r-[72px] xl:rounded-r-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 sm:space-y-5 max-w-2xl">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-2">Beasiswa</p>
                <h2 className="section-title text-primary-600">{content.title}</h2>
                <div className="w-10 h-1 rounded-full bg-primary-300 mt-3" />
              </div>
              <p className="section-subtitle text-gray-600">{content.description}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleButtonClick} className="w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                  {content.buttonText}
                </button>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6">
              <div className="relative w-full overflow-hidden rounded-2xl shadow-md bg-white group">

                <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[3/2]">
                  <img
                    src={content.image || './read-book.webp'}
                    alt="Mahasiswa penerima beasiswa Bank Indonesia"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = './read-book.webp';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ScholarshipSection;
