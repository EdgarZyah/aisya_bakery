import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/common/table";
import Button from "../../components/common/button";
import Loader from "../../components/common/loader";
import Modal from "../../components/common/modal";
import Pagination from "../../components/pagination";
import SearchBar from "../../components/searchBar";
import axiosClient from "../../api/axiosClient";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }
    try {
      const response = await axiosClient.get("/auth/users", {
        headers: { "x-auth-token": token },
      });
      setUsers(response.data);
      setError(null);
    } catch (e) {
      setError(e.message);
      setModalTitle("Error");
      setModalMessage(e.message);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setUserToUpdate(user);
    if (loggedInUser.id === user.id) {
      setIsPasswordModalOpen(true);
    } else {
      setNewRole(user.role);
      setIsEditRoleModalOpen(true);
    }
  };

  const handleUpdateRole = async () => {
    const token = localStorage.getItem("token");
    try {
      await axiosClient.put(
        `/auth/users/role/${userToUpdate.id}`,
        { role: newRole },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      setIsEditRoleModalOpen(false);
      setModalTitle("Berhasil");
      setModalMessage(`Role pengguna berhasil diubah menjadi ${newRole}.`);
      setIsModalOpen(true);
      fetchUsers();
    } catch (e) {
      setIsEditRoleModalOpen(false);
      setModalTitle("Error");
      setModalMessage(`Error: ${e.response?.data?.msg || e.message}`);
      setIsModalOpen(true);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setModalTitle("Peringatan");
      setModalMessage("Password baru tidak cocok dengan konfirmasi password.");
      setIsModalOpen(true);
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axiosClient.put(
        `/auth/users/${userToUpdate.id}/password`,
        { newPassword, confirmNewPassword },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      setIsPasswordModalOpen(false);
      setModalTitle("Berhasil");
      setModalMessage("Password berhasil diperbarui.");
      setIsModalOpen(true);
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e) {
      setModalTitle("Error");
      setModalMessage(`Error: ${e.response?.data?.msg || e.message}`);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditRoleModalOpen(false);
    setIsPasswordModalOpen(false);
    setUserToUpdate(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Nama", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Alamat", accessor: "address" },
    { header: "No. Telepon", accessor: "phoneNumber" },
  ];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedData = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">List Pengguna</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="flex items-center gap-2">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            id="role-filter"
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border rounded h-10"
          >
            <option value="all">Semua</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <Table
        columns={columns}
        data={paginatedData}
        renderActions={(row) => (
          <button
            onClick={() => handleEditClick(row)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      />
      <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />

      {/* Modal Edit Role */}
      <Modal
        isOpen={isEditRoleModalOpen}
        onClose={handleCloseModal}
        title={`Edit Role untuk ${userToUpdate?.name}`}
      >
        <p className="mb-4">Pilih peran baru untuk pengguna ini.</p>
        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="role-select" className="font-medium">
            Peran:
          </label>
          <select
            id="role-select"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleUpdateRole}>
            Simpan
          </Button>
        </div>
      </Modal>

      {/* Modal Ganti Password */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={handleCloseModal}
        title={`Ganti Password untuk ${userToUpdate?.name}`}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleUpdatePassword}>
            Simpan Password
          </Button>
        </div>
      </Modal>

      {/* Modal Pesan (Berhasil/Error) */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={modalTitle}>
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ListUser;
