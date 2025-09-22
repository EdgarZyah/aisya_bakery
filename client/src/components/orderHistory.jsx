const OrderHistory = ({ orders }) => (
  <div className="max-w-4xl mx-auto p-6">
    <h2 className="text-2xl font-bold mb-6">Riwayat Pesanan</h2>
    {orders.length === 0 ? (
      <p>Tidak ada pesanan.</p>
    ) : (
      orders.map(order => (
        <div key={order.id} className="border p-4 rounded mb-4">
          <div className="font-semibold">Order #{order.id}</div>
          <div>Status: {order.status}</div>
          <div>Total: {order.total}</div>
        </div>
      ))
    )}
  </div>
);
