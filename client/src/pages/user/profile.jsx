import React, { useState, useEffect } from 'react';
import Card from '../../components/common/card';
import Button from '../../components/common/button';
import Loader from '../../components/common/loader';
import Input from '../../components/common/input';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/modal';
import axiosClient from '../../api/axiosClient';

const UserProfilePage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
      if (!userId) {
        setError('Pengguna tidak terautentikasi.');
        setLoading(false);
        return;
      }
      try {
        const response = await axiosClient.get(`/auth/users/${userId}`, {
          headers: { 'x-auth-token': token },
        });
        setUser(response.data);
        setForm(response.data);
      } catch (err) {
        setError(err.message);
        setModalTitle("Error");
        setModalMessage(`Error: ${err.message}`);
        setIsModalOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
    try {
      const response = await axiosClient.put(`/auth/users/${userId}`, form, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });
      setUser(response.data.user);
      setIsEditing(false);
      setModalTitle("Berhasil");
      setModalMessage('Profil berhasil diperbarui!');
      setIsModalOpen(true);
    } catch (err) {
      setModalTitle("Error");
      setModalMessage(`Error: ${err.message}`);
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <Card className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Profil Saya</h2>
        {!isEditing ? (
          <div>
            <div className="mb-2"><strong>Nama:</strong> {user.name}</div>
            <div className="mb-2"><strong>Email:</strong> {user.email}</div>
            <div className="mb-2"><strong>Alamat:</strong> {user.address || 'Tidak ada'}</div>
            <div className="mb-4"><strong>No. Telepon:</strong> {user.phoneNumber || 'Tidak ada'}</div>
            <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Profil</Button>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <Input label="Nama" name="name" value={form.name || ""} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email || ""} onChange={handleChange} required />
            <Input label="Alamat" name="address" value={form.address || ""} onChange={handleChange} />
            <Input label="No. Telepon" name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} />
            <div className="flex gap-4 mt-4">
              <Button type="submit" variant="primary">Simpan</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Batal</Button>
            </div>
          </form>
        )}
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>OK</Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfilePage;
