import React from "react";

const Dashboard = () => {
  return (
    <div className="p-6 bg-purewhite text-[var(--color-text)] min-h-screen">
      <div className="">
        <main className="">
          <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">
            Dashboard
          </h1>
          <p>
            Selamat datang di dashboard. Anda dapat mengelola produk, pesanan,
            dan profil Anda di sini.
          </p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
