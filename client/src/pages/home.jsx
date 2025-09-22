import React from "react";
import Hero from "../components/hero";
import FeaturedProducts from "../components/featuredProducts";
import BreadBanner from "../assets/Bread_and_wheat_on_wooden_background.jpg";

const testimonials = [
  {
    id: 1,
    name: "Andi Saputra",
    comment:
      "Roti dan kue di sini selalu segar dan rasanya luar biasa! Saya sangat puas dengan pelayanannya.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sari Dewi",
    comment:
      "Tempat yang tepat untuk mencari roti enak. Pilihan produk lengkap dan stafnya ramah.",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 3,
    name: "Budi Hartono",
    comment:
      "Kue ulang tahun yang saya pesan sangat cantik dan lezat. Recomended!",
    avatar: "https://randomuser.me/api/portraits/men/56.jpg",
  },
];

const Home = () => {
  return (
    <main className="w-full mx-auto">
      {/* Hero Section */}
      <Hero
        title="Selamat Datang di Aisya Bakery"
        subtitle="Nikmati aroma segar roti dan kue kami yang dibuat dengan cinta dan bahan alami."
        ctaText="Lihat Produk"
        onCtaClick={() => alert("Navigasi ke Produk")}
      />

      {/* About Us Section with background image */}
      <section className="relative flex w-full min-h-[800px] bg-primary -mb-12">
                <img
          src="https://www.shutterstock.com/image-photo/fresh-baked-bread-flour-wheat-600nw-2409821173.jpg"
          alt="Bread pattern background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 max-w-5xl flex flex-col items-center mx-12 my-6 sm:m-auto px-6 py-16 text-center bg-white text-primary rounded-lg">
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

      {/* Testimonials Section with background image */}
      <section className="relative w-full min-h-[500px] -mb-16">
        <img
          src={BreadBanner}
          alt="Bread and Wheat on Wooden Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-[var(--color-background)]">
          <h2 className="col-span-full text-center text-3xl font-semibold mb-12">
            Testimonials
          </h2>
          {testimonials.map(({ id, name, comment, avatar }) => (
            <div
              key={id}
              className="flex flex-col items-center bg-[var(--color-primary)] bg-opacity-70 rounded-lg p-6 shadow-lg"
            >
              <img
                src={avatar}
                alt={name}
                className="rounded-full w-24 h-24 mb-4 object-cover border-2 border-[var(--color-background)]"
              />
              <p className="italic mb-4 text-center">"{comment}"</p>
              <h4 className="font-semibold">{name}</h4>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
