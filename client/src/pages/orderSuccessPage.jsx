import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from "../components/common/card";
import Button from "../components/common/button";
import WhatsAppConfirmation from "../components/WhatsAppConfirmation";
import Modal from '../components/common/modal';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderData, checkoutItems, user } = location.state || {};
    const [showWarningModal, setShowWarningModal] = useState(false);

    if (!orderData || !user || !checkoutItems) {
        return (
            <div className="flex justify-center items-center min-h-screen p-6">
                <Card className="max-w-xl text-center">
                    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Akses Ditolak</h2>
                    <p className="mb-4 text-[var(--color-text)]">
                        Detail pesanan tidak ditemukan. Silakan cek riwayat pesanan Anda.
                    </p>
                    <Button variant="primary" onClick={() => navigate("/user/orders")}>
                        Lihat Pesanan Saya
                    </Button>
                </Card>
            </div>
        );
    }
    
    const totalCheckout = checkoutItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleViewOrdersClick = () => {
        setShowWarningModal(true);
    };
    
    const handleNavigateToOrders = () => {
        setShowWarningModal(false);
        navigate("/user/orders");
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <Card className="max-w-xl text-center">
                <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Pesanan Berhasil!</h2>
                <p className="mb-4 text-[var(--color-text)]">
                    Terima kasih atas pesanan Anda. Berikut detail pesanan Anda:
                </p>
                <div className="border-t border-b py-4 mb-4 text-[var(--color-text)]">
                    <p><strong>ID Pesanan:</strong> {orderData.orderId}</p>
                    <p><strong>Total Pembayaran:</strong> Rp {totalCheckout.toLocaleString("id-ID")}</p>
                    <p className="mt-2">
                        Silakan konfirmasi pesanan Anda melalui WhatsApp untuk proses lebih lanjut.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    {user && user.phoneNumber ? (
                        <WhatsAppConfirmation
                            orderId={orderData.orderId}
                            total={totalCheckout}
                            items={checkoutItems}
                            userName={user.name}
                            userPhone={user.phoneNumber}
                        />
                    ) : (
                        <div className="text-center p-4 bg-gray-100 rounded">
                            <p className="text-sm text-gray-700">
                                Nomor telepon tidak ditemukan. Silakan perbarui profil Anda untuk mengaktifkan konfirmasi via WhatsApp.
                            </p>
                            <Button variant="outline" onClick={() => navigate("/user/profile")} className="w-full mt-2">
                                Perbarui Profil
                            </Button>
                        </div>
                    )}
                    <Button
                        variant="outline"
                        onClick={handleViewOrdersClick}
                        className="w-full"
                    >
                        Lihat Pesanan Saya
                    </Button>
                </div>
            </Card>
            <Modal isOpen={showWarningModal} onClose={() => setShowWarningModal(false)} title="Peringatan">
                <p>
                    Sebelum melanjutkan, pastikan Anda sudah mengkonfirmasi pesanan melalui WhatsApp. Dengan menekan tombol "Lanjutkan", Anda akan diarahkan ke halaman riwayat pesanan.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowWarningModal(false)}>Batal</Button>
                    <Button variant="primary" onClick={handleNavigateToOrders}>Lanjutkan</Button>
                </div>
            </Modal>
        </div>
    );
};

export default OrderSuccessPage;