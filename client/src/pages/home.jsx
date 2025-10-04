import React from "react";
import Hero from "../components/hero";
import FeaturedProducts from "../components/featuredProducts";
import Testimoni from "../components/testimoni"; // Impor komponen Testimoni

const Home = () => {
  return (
    <main className="w-full mx-auto">
      {/* Hero Section */}
      <Hero
        title="Selamat Datang di Aisya Bakery"
        subtitle="Nikmati aroma segar roti dan kue kami yang dibuat dengan cinta dan bahan alami."
      />
      {/* About Us Section */}
      <section className="relative flex w-full min-h-[800px] bg-[var(--color-primary)] -mb-12">
        <img
          src="https://www.shutterstock.com/image-photo/fresh-baked-bread-flour-wheat-600nw-2409821173.jpg"
          alt="Bread pattern background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 max-w-5xl flex flex-col items-center mx-12 my-6 sm:m-auto px-6 py-16 text-center bg-white text-[var(--color-primary)] rounded-lg">
          <h2 className="text-3xl font-semibold mb-4">Tentang Kami</h2>
          <p className="max-w-3xl mx-auto leading-relaxed">
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
      <section className="max-w-5xl mx-auto px-6 py-16 mt-10">
        <div className="w-full mb-8">
          <h1 className="text-center text-3xl font-semibold text-[var(--color-primary)]">
            Produk Unggulan
          </h1>
        </div>
        <div className="flex justify-start mb-8">
          <div className="w-full bg-[var(--color-background)] rounded-lg p-6">
            <p className="text-center text-[var(--color-text)]">
              Pilih produk unggulan terbaik kami yang selalu segar dan lezat.
            </p>
          </div>
        </div>
        <FeaturedProducts />
      </section>
      {/* Map Section */}
      <div className="bg-[var(--color-primary)] mx-auto py-10 px-6">
        <div className="max-w-5xl m-auto rounded-lg space-y-6 shadow-md aspect-video">
          <h1 className="text-center text-3xl font-semibold text-purewhite">
            Lokasi Toko Kami
          </h1>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.2064722791883!2d108.6799144!3d-7.3306931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f7d7f00d30735%3A0x3ba843376824279d!2sAisya%20Cake%2C%20Bread%20%26%20Cookies!5e0!3m2!1sid!2sid!4v1758958114116!5m2!1sid!2sid"
            className="w-full h-full border-0"
            allowfullscreen="true"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      {/* Testimonials Section (Carousel) */}
      <Testimoni />
    </main>
  );
};

export default Home;
