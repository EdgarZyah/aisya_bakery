import React from "react";

const Dashboard = () => {
  return (
    <div className="flex bg-purewhite min-h-screen text-[var(--color-text)]">
      <main className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">Dashboard</h1>
        <p>Selamat datang di dashboard. Anda dapat mengelola produk, pesanan, dan profil Anda di sini.</p>
      </main>
    </div>
  );
};

export default Dashboard;
