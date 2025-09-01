import { ChevronRight } from 'lucide-react';
import MediaPlaceholder from '../components/shared/MediaPlaceholder';

const ArticleContentPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button onClick={() => onNavigate('home')} className="hover:text-primary-600 transition-colors">
            Beranda
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => onNavigate('articles')} className="hover:text-primary-600 transition-colors">
            Artikel
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Judul Artikel</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Judul Artikel Lorem ipsum dolor sit amet consectetur Ut dignissim risus auctor mauris quis phasellus</h1>
          <div className="text-sm text-gray-500 mb-6">
            <span className="font-medium">Penulis</span>
            <br />
            Date, Month, Year
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <MediaPlaceholder ratio="16/9" label="Gambar Utama Artikel" />
          <p className="text-center text-xs text-gray-500 mt-2">Sumber : Source Pic</p>
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 transform hover:shadow-md transition-shadow duration-300">
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              Lorem ipsum dolor sit amet consectetur. Ut dignissim risus auctor mauris quis phasellus cursus sed. Iaculis feugiat morbi volutpat convallis venenatis aliquet lorem commodo adipiscing. Ullamcorper gravida semper egestas purus
              sed risus. Odoeus sem iaculis in posuere. Nunc mauris egestas faucibus est neque nisl pretium id ac. Arcu purus commodo elit donec aliquam mauris. Lobortis urna dictum facilisis in lorem vivamus viverra. Proin vitae odio
              cursus orci ac tellus viverra tristique.
            </p>

            <p className="mb-4">
              Commodo vitae elementum massa scelerisque rhoncus nunc. Dis mauris ipsum justo placerat. Nisi suspendisse non pretium tellus amet. At bibendum eu ultrices venenatis feugiat. Potin amet mattis amet nunc semper nunc nibh eu
              feugiat.
            </p>

            <p className="mb-4">
              Congue sit lacus pharetra adipiscing. Leo sed orci ut nibh porttitor. Massa eget libero dui sit a nam. Arcu consequat ultrices vitae felis in quam tortor. Tellus suscipit massa sit at non mauris. Consectetur molestie sapien ut
              quam amet justo aliquam. Porta est nulla pede at nullam. Vitae cursus nunc magna elementum quam pretium. Sit odio magna cursus arcu bibendum congue. Massa eget at lectus. Feugiat cursus in eleifend sit quis. Nulla ipsum
              suscipit sed maecenas quis vehicula.
            </p>

            <p className="mb-4">
              Donec eu viverra faucibus dignissim urna pharetra nunc adipiscing. Sit venenatis arcu senectus odio amet facilisis pretium fames vitae. Scelerisque porttitor aliquam diam amet molestudsa senean urna rhoncus. Enim diam bibendum
              tincidunt ornare praesent elementum ultrices. At eget faucibus dignissim tristique mi lectus lectus suscipit vitae. Curabitur eu et enim lorem eleifend non lacinia. Facilisis in odio neque augue vel at sed ultrices. Facilisis
              non dis purus augue nibh. Pharetra et lectus senectus proin in at ut risus viverra. Laoreet rutie dictum facilisis in lorem vivamus viverra. Proin amet vitae odio cursus orci ac tellus viverra tristique.
            </p>

            <p className="mb-4">
              Commodo vitae elementum massa scelerisque rhoncus nunc enim ut nec magna. Scelerisque ac nibh aliquet odio suscipit. Porttitor mauris ut donec sit molestie dui. Pretium ornare ipsum lobortis fusce donec pretium. Ipsum enim a
              id tincidunt rhoncus.
            </p>

            <p className="mb-4">
              Quis sit lacus pharetra adipiscing. Leo sed orci ut nibh porttitor. Massa eleifend nelit dictum urna mattis. Ullamcorper aliquam. Fusce urna pharetra penatibus massa. Et pretium id cursus mattis cursus sed.
            </p>

            <p>
              Ut sit egestas odio nulla pellentesque blandit im interdum vulputate. Hendrerit magna consequat viverra arcu urna. Pretium pellentesque viverra sit cursus quis sem porttitor tellus. Tempus suspendisse tellus ut iaculis cursus
              augue sem ipsum adipiscing. Facilisis ut amet leo dolor amet metus integer. Penatibus mauris laoreet vitae metus pharetra bibendum pharetra viverra egestas. Erat lobortis convallis mauris veli feugiat morbi. Cursus blandit
              aliquam imperdiet faucibus. Venenatis ut urna scelerisque feugiat gravida interdum aliquam id tempus. Nullam dui arcu pretium faucibus. Lorem rhoncus nibh diam metus pretium. Purus ornare nisl at intereger facilisis enim in
              mattis enim. Nulla id aliquam eleifend leo lectus morbi lectus aliquet non. Interdum placerat fringilla nisl eget amet penatibus. Nisl euismod lor in sed ultrices quisque elementum phasellus.
            </p>
          </div>
        </article>

        {/* References Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 transform hover:shadow-md transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Referensi</h2>

          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Haryono, E. (2023, Jury 7). Bank Indonesia Bersinergi Dengan Perguruan Tinggi Dorong Perilasaan Literasi Keuangan Umkm Melalui Siapik. Retrieved from <span className="text-blue-600 underline">https://www.bi.go.id</span>
            </p>

            <p>
              Mundhayah, H. (2022). Mengenal SIAPIK, Aplikasi Pencatatan Laporan Keuangan. Retrieved from Pajak.com: <span className="text-blue-600 underline">https://www.pajak.com</span>
            </p>

            <p>Sri Anjarawati, A. P. (2023). Efektifitas Aplikasi Si APIK untuk Kebutuban. Dedikasi: Jurnal Pengabdian Kepada Masyarakat. 232-248.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArticleContentPage;
