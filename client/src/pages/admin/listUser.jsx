import React, { useState, useEffect } from "react";
import Table from "../../components/common/table";
import Loader from "../../components/common/loader";
import SearchBar from "../../components/searchBar";
import Button from "../../components/common/button";

const API_URL = "http://localhost:5000/api/auth/users";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        headers: {
          'x-auth-token': token,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Gagal memuat data pengguna');
      }
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter dan Pencarian Data
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }
  
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">List Pengguna</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSubmit={(e) => e.preventDefault()}
        />
        <div className="flex gap-2">
          <Button
            onClick={() => setFilterRole("all")}
            variant={filterRole === "all" ? "primary" : "outline"}
          >
            Semua
          </Button>
          <Button
            onClick={() => setFilterRole("user")}
            variant={filterRole === "user" ? "primary" : "outline"}
          >
            User
          </Button>
          <Button
            onClick={() => setFilterRole("admin")}
            variant={filterRole === "admin" ? "primary" : "outline"}
          >
            Admin
          </Button>
        </div>
      </div>
      <Table columns={columns} data={filteredUsers} />
    </div>
  );
};

export default ListUser;