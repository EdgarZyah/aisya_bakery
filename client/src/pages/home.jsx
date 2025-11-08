import React from "react";
import Hero from "../components/hero";
import FeaturedProducts from "../components/featuredProducts";
import Testimoni from "../components/testimoni";
import BreadHero from "../assets/bread-rye-bread-baked-goods-baguette-wallpaper-preview.jpg";

const Home = () => {
  return (
    // Hapus w-full mx-auto di sini jika layout utama sudah menanganinya
    <main>
      {/* Hero Section - Diasumsikan sudah responsif */}
      <Hero
        title="Selamat Datang di Aisya Bakery"
        subtitle="Nikmati aroma segar roti dan kue kami yang dibuat dengan cinta dan bahan alami."
      />

      {/* About Us Section */}
      {/* Kurangi min-height dan sesuaikan padding/margin */}
      <section className="relative flex w-full min-h-[600px] sm:min-h-[700px] bg-[var(--color-primary)] -mb-12 py-12 px-4 sm:px-6 lg:px-8">
        <img
          src={BreadHero}
          alt="Bread pattern background"
          className="absolute inset-0 w-full h-full object-cover brightness-40"
        />
        {/* Kontainer konten About Us */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center mx-auto my-auto px-4 py-10 sm:px-6 sm:py-16 text-center bg-white text-[var(--color-primary)] rounded-lg">
           {/* Sesuaikan ukuran judul untuk mobile */}
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Tentang Kami</h2>
          {/* Pastikan max-width tidak terlalu besar untuk mobile */}
          <p className="max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
            Kami adalah bakery lokal dengan pengalaman puluhan tahun yang secara
            konsisten menghadirkan produk roti dan kue berkualitas tinggi untuk
            dinikmati oleh keluarga dan komunitas sekitar. Dengan mengedepankan
            tradisi dan resep turun-temurun yang terjaga keasliannya, kami
            berkomitmen untuk mempertahankan rasa autentik serta tekstur
            sempurna yang membuat setiap gigitan terasa istimewa. Kami memilih
            hanya bahan-bahan alami terbaik dan segar sebagai bahan baku, tanpa
            menggunakan pengawet atau bahan kimia berbahaya, untuk memastikan
            produk yang sehat dan aman untuk seluruh anggota keluarga. Proses
            produksi kami menggabungkan teknik tradisional berpadu dengan
            inovasi modern untuk menghasilkan roti dan kue yang tidak hanya
            lezat tapi juga bergizi. Lebih dari sekadar bisnis, kami percaya
            bahwa bakery kami adalah tempat di mana cerita dan kenangan manis
            tercipta. Pelayanan prima kepada pelanggan, kejujuran dalam
            kualitas, dan kepuasan pelanggan adalah pondasi utama yang selalu
            kami jaga. Kami turut bangga menjadi bagian dari hari-hari spesial
            Anda dengan produk-produk kami yang penuh cinta dan dedikasi.
          </p>
        </div>
      </section>

      {/* Featured Products Section */}
      {/* Sesuaikan padding */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-10">
        <div className="w-full mb-8">
           {/* Sesuaikan ukuran judul */}
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-[var(--color-primary)]">
            Produk Unggulan
          </h1>
        </div>
        {/* Tambahkan padding di div ini jika perlu, atau biarkan default */}
        <div className="flex justify-start mb-8">
          <div className="w-full bg-[var(--color-background)] rounded-lg p-4 sm:p-6">
            <p className="text-center text-[var(--color-text)] text-sm sm:text-base">
              Pilih produk unggulan terbaik kami yang selalu segar dan lezat.
            </p>
          </div>
        </div>
        {/* FeaturedProducts diasumsikan sudah responsif */}
        <FeaturedProducts />
      </section>
      {/* Testimonials Section (Carousel) - Diasumsikan sudah responsif */}
      <Testimoni />
    </main>
  );
};

export default Home;