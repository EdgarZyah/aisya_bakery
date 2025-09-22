import Table from "../../components/common/table";

const columns = [
  { header: "Tanggal", accessor: "date" },
  { header: "ID Pesanan", accessor: "orderId" },
  { header: "Total", accessor: "total", cell: (row) => "Rp" + row.total.toLocaleString("id-ID") },
  { header: "Metode", accessor: "paymentMethod" },
];

<Table
  columns={columns}
  data={transactions}
  renderActions={(row) => (
    <button onClick={() => handleDetail(row)} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-secondary)]">
      Lihat Detail
    </button>
  )}
/>
