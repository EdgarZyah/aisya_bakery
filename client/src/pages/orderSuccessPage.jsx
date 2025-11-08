import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from "../components/common/card";
import Button from "../components/common/button";
import WhatsAppConfirmation from "../components/WhatsAppConfirmation";
import Modal from '../components/common/modal';
import Input from "../components/common/input"; // <-- Impor baru
import axiosClient from "../api/axiosClient"; // <-- Impor baru
import Qris from '../assets/payment.jpg'; // This image is now used

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderData, checkoutItems, user } = location.state || {};
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('qris');

    // --- State Baru dari MyOrdersPage ---
    const [paymentProof, setPaymentProof] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageTitle, setMessageTitle] = useState("");
    const [messageContent, setMessageContent] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState(false); // Untuk navigasi setelah sukses

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

    const ADMIN_FEE = 2500;
    const finalTotal = paymentMethod === 'bank' ? totalCheckout + ADMIN_FEE : totalCheckout;

    const handleViewOrdersClick = () => {
        setShowWarningModal(true);
    };
    
    const handleNavigateToOrders = () => {
        setShowWarningModal(false);
        navigate("/user/orders");
    };

    // --- Handler Baru dari MyOrdersPage ---

    const handleCloseMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessageTitle("");
        setMessageContent("");
        // Jika unggah berhasil, arahkan ke riwayat pesanan
        if (uploadSuccess) {
            navigate("/user/orders");
        }
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                setMessageTitle("Peringatan");
                setMessageContent("Hanya file JPG, JPEG, PNG, dan PDF yang diizinkan.");
                setIsMessageModalOpen(true);
                setPaymentProof(null);
                e.target.value = null; // Reset input file
                return;
            }
        }
        setPaymentProof(file);
    };

    const handleUploadPaymentProof = async () => {
        if (!paymentProof) {
            setMessageTitle("Peringatan");
            setMessageContent("Pilih file terlebih dahulu.");
            setIsMessageModalOpen(true);
            return;
        }
        setUploading(true);
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("paymentProof", paymentProof);

        try {
            // Menggunakan orderData.orderId dari location.state
            const response = await axiosClient.put(
                `/orders/upload-payment-proof/${orderData.orderId}`,
                formData,
                {
                    headers: {
                        "x-auth-token": token,
                    },
                }
            );
            setMessageTitle("Berhasil");
            setMessageContent("Bukti pembayaran berhasil diunggah!");
            setIsMessageModalOpen(true);
            setUploadSuccess(true); // Set flag sukses
            setPaymentProof(null); // Kosongkan file input
        } catch (e) {
            setMessageTitle("Error");
            setMessageContent(`Error: ${e.response?.data?.message || e.message}`);
            setIsMessageModalOpen(true);
        } finally {
            setUploading(false);
        }
    };
    // --- Akhir dari Handler Baru ---

    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <Card className="max-w-xl text-center">
                <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Pesanan Berhasil Dibuat!</h2>
                <p className="mb-4 text-[var(--color-text)]">
                    Terima kasih atas pesanan Anda. Berikut detail pesanan yang Anda harus dibayarkan
                </p>
                
                <div className="border-t border-b py-4 mb-4 text-[var(--color-text)] text-left">
                    <p className="text-center"><strong>ID Pesanan:</strong> {orderData.orderId}</p>

                    {/* Payment Method Dropdown */}
                    <div className="my-4">
                        {/* ... (kode dropdown metode pembayaran tidak berubah) ... */}
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                            Metode Pembayaran
                        </label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)]"
                        >
                            <option value="qris">QRIS</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>

                    {/* Conditional Payment Details */}
                    <div className="my-4 p-4 bg-gray-50 rounded-lg">
                        {/* ... (kode detail pembayaran QRIS & Bank tidak berubah) ... */}
                        {paymentMethod === 'qris' && (
                            <div>
                                <p className="text-sm font-semibold text-center mb-2">Scan QRIS di Bawah Ini</p>
                                <img 
                                    src={Qris} 
                                    alt="QRIS Payment" 
                                    className="mx-auto w-48 h-48 md:w-1/2 md:h-1/2 object-contain" 
                                />
                            </div>
                        )}
                        {paymentMethod === 'bank' && (
                            <div>
                                <p className="text-sm font-semibold mb-2">Transfer ke Rekening Berikut:</p>
                                <div className="p-3 bg-white border rounded-md text-sm">
                                    <p><strong>Bank:</strong> Bank Rakyat Indonesia (BRI)</p>
                                    <p><strong>No. Rekening:</strong> 3770-01-029919-53-1</p>
                                    <p><strong>Atas Nama:</strong> Haryanti</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-4">
                        {/* ... (kode total pembayaran tidak berubah) ... */}
                        {paymentMethod === 'bank' && (
                            <>
                                <p className="text-sm">Subtotal: Rp {totalCheckout.toLocaleString("id-ID")}</p>
                                <p className="text-sm">Biaya Admin: Rp {ADMIN_FEE.toLocaleString("id-ID")}</p>
                            </>
                        )}
                        <p className="font-bold text-lg mt-1">
                            Total Pembayaran: Rp {finalTotal.toLocaleString("id-ID")}
                        </p>
                    </div>
                    {/* --- KODE BARU: UPLOAD BUKTI PEMBAYARAN --- */}
                    <div className="mt-4 p-4 border rounded">
                        <h4 className="font-semibold mb-2 text-center">Unggah Bukti Pembayaran</h4>
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                            label="Pilih file bukti pembayaran (JPG, PNG, PDF)"
                        />
                        <Button onClick={handleUploadPaymentProof} disabled={uploading} className="w-full mt-2">
                            {uploading ? "Mengunggah..." : "Unggah Bukti Pembayaran"}
                        </Button>
                    </div>
                    {/* --- AKHIR KODE BARU --- */}
                    <p className="mt-2 text-center text-sm">
                        Silakan konfirmasi pesanan Anda melalui WhatsApp.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {user && user.phoneNumber ? (
                        <WhatsAppConfirmation
                            orderId={orderData.orderId}
                            total={finalTotal}
                            items={checkoutItems}
                            userName={user.name}
                            userPhone={user.phoneNumber}
                        />
                    ) : (
                        <div className="text-center p-4 bg-gray-100 rounded">
                            {/* ... (kode fallback nomor telepon tidak berubah) ... */}
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

            {/* Modal Peringatan (sudah ada) */}
            <Modal isOpen={showWarningModal} onClose={() => setShowWarningModal(false)} title="Peringatan">
                <p>
                    Sebelum melanjutkan, pastikan Anda sudah mengkonfirmasi pesanan melalui WhatsApp. Dengan menekan tombol "Lanjutkan", Anda akan diarahkan ke halaman riwayat pesanan.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowWarningModal(false)}>Batal</Button>
                    <Button variant="primary" onClick={handleNavigateToOrders}>Lanjutkan</Button>
                </div>
            </Modal>

            {/* --- KODE BARU: Modal Pesan --- */}
            <Modal isOpen={isMessageModalOpen} onClose={handleCloseMessageModal} title={messageTitle}>
                <p>{messageContent}</p>
                <div className="mt-4 flex justify-end">
                    <Button variant="primary" onClick={handleCloseMessageModal}>OK</Button>
                </div>
            </Modal>
        </div>
    );
};

export default OrderSuccessPage;