import React from "react";
import Button from "./common/button";
import Card from "./common/card";

const CartItem = ({ item, onRemove }) => (
  <div className="flex justify-between items-center border-b py-3">
    <div className="flex items-center space-x-4">
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
      <div>
        <h4 className="font-semibold text-[var(--color-text)]">{item.name}</h4>
        <p className="text-sm text-[var(--color-primary)]">{item.price}</p>
        <p className="text-sm">Qty: {item.quantity}</p>
      </div>
    </div>
    <Button variant="outline" onClick={() => onRemove(item.id)}>
      Hapus
    </Button>
  </div>
);

const Cart = ({ items, onRemoveItem, onCheckout }) => {
  const total = items.reduce((sum, item) => {
    const priceNum = Number(item.price.replace(/[^0-9]/g, "")) || 0;
    return sum + priceNum * item.quantity;
  }, 0);

  return (
    <Card className="max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold mb-6 text-[var(--color-secondary)]">Keranjang Belanja</h2>
      {items.length === 0 ? (
        <p>Keranjang kosong</p>
      ) : (
        <>
          <div>
            {items.map((item) => (
              <CartItem key={item.id} item={item} onRemove={onRemoveItem} />
            ))}
          </div>
          <div className="mt-6 flex justify-between font-semibold text-[var(--color-primary)]">
            <span>Total:</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
          <Button
            variant="primary"
            className="mt-6 w-full"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Checkout
          </Button>
        </>
      )}
    </Card>
  );
};

export default Cart;
