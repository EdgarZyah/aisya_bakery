import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/card';
import { FaBox, FaPlus, FaTags } from 'react-icons/fa';

const ManagementPage = () => {
  return (
    <div className="p-6 bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">
      <h2 className="text-3xl font-semibold mb-8">Manajemen Toko</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Shortcut ke List Produk */}
        <Link to="/admin/list-product">
          <Card className="flex flex-col items-center p-6 text-center hover:bg-gray-100 transition h-full">
            <FaBox className="text-4xl text-[var(--color-primary)] mb-4" />
            <h3 className="text-xl font-bold mb-2">Kelola Produk</h3>
            <p className="text-sm text-gray-600">Lihat, edit, dan hapus semua produk yang tersedia.</p>
          </Card>
        </Link>

        {/* Shortcut ke Tambah Produk */}
        <Link to="/admin/add-product">
          <Card className="flex flex-col items-center p-6 text-center hover:bg-gray-100 transition h-full">
            <FaPlus className="text-4xl text-[var(--color-primary)] mb-4" />
            <h3 className="text-xl font-bold mb-2">Tambah Produk Baru</h3>
            <p className="text-sm text-gray-600">Formulir untuk menambahkan produk roti atau kue baru.</p>
          </Card>
        </Link>
        
        {/* Shortcut ke Kelola Kategori */}
        <Link to="/admin/categories">
          <Card className="flex flex-col items-center p-6 text-center hover:bg-gray-100 transition h-full">
            <FaTags className="text-4xl text-[var(--color-primary)] mb-4" />
            <h3 className="text-xl font-bold mb-2">Kelola Kategori</h3>
            <p className="text-sm text-gray-600">Tambah dan hapus kategori untuk mengorganisir produk.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default ManagementPage;