import React, { useState } from "react";
import Table from "../../components/common/table";

const ListUser = () => {
  const [users, setUsers] = useState([
    { id: 1, username: "admin", email: "admin@example.com", role: "Admin" },
    { id: 2, username: "johndoe", email: "john@example.com", role: "User" },
    { id: 3, username: "janedoe", email: "jane@example.com", role: "User" },
  ]);

  const columns = [
    { header: "#", accessor: "index", cell: (_, idx) => idx + 1 },
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
  ];

  return (
    <div className="p-6 bg-purewhite text-[var(--color-text)] min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Daftar User Terdaftar</h2>
      <Table columns={columns} data={users} />
    </div>
  );
};

export default ListUser;
