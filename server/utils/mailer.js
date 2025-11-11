const nodemailer = require("nodemailer");
// [BARU] Impor model database untuk menghitung subtotal
const db = require('../models');
const OrderItem = db.OrderItem;
const Product = db.Product;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Fungsi untuk mengirim notifikasi unggah bukti bayar
 * @param {object} order - Objek order
 * @param {object} user - Objek user 
 */
const sendPaymentUploadNotification = async (order, user) => {
  const paymentProofUrl = `${process.env.BASE_URL}/${order.paymentProofUrl}`;
  const formattedDate = new Date(order.createdAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  try {
    // --- [LOGIKA BARU] ---
    // 1. Ambil semua item dalam pesanan ini untuk menghitung subtotal
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['price'] // Kita hanya butuh harga
      }]
    });

    // 2. Hitung subtotal (harga item * kuantitas)
    const subtotal = orderItems.reduce((acc, item) => {
      const price = item.product?.price || 0;
      return acc + (price * item.quantity);
    }, 0);

    // 3. Hitung ongkir (Total dari DB - Subtotal)
    const shippingCost = order.total - subtotal;

    // 4. Format semua angka
    const formattedSubtotal = new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR", minimumFractionDigits: 0
    }).format(subtotal);

    const formattedShipping = new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR", minimumFractionDigits: 0
    }).format(Math.max(0, shippingCost)); // Math.max untuk hindari angka negatif

    const formattedTotal = new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR", minimumFractionDigits: 0
    }).format(order.total);
    // --- AKHIR LOGIKA BARU ---


    const mailOptions = {
      from: `"Aisya Bakery" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_ADMIN,
      subject: `Pembayaran Baru untuk Pesanan #${order.id}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
        max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          
          <div style="background-color: #B08968; color: white; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Aisya Bakery</h1>
          </div>

          <div style="padding: 30px;">
            <h2 style="font-size: 20px; color: #333;">Notifikasi Pembayaran Baru</h2>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Halo Admin Aisya Bakery,
              <br>
              Satu pembayaran baru oleh pelanggan ${
                user.name
              } untuk pesanan <strong>#${order.id}</strong>.
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
              <thead>
                <tr>
                  <th colspan="2" style="background-color: #f7f7f7; padding: 12px; text-align: left; 
                  font-size: 16px; color: #333;">
                    Detail Pesanan
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px; font-size: 14px; color: #555; width: 40%;">ID Pesanan:</td>
                  <td style="padding: 12px; font-size: 14px; color: #333; font-weight: bold;">#${
                    order.id
                  }</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px; font-size: 14px; color: #555;">Pemesan:</td>
                  <td style="padding: 12px; font-size: 14px; color: #333;">${
                    user.name
                  } (${user.email})</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px; font-size: 14px; color: #555;">Tanggal Pesan:</td>
                  <td style="padding: 12px; font-size: 14px; color: #333;">${formattedDate}</td>
                </tr>
                
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px; font-size: 14px; color: #555;">Subtotal (Item):</td>
                  <td style="padding: 12px; font-size: 14px; color: #333;">${formattedSubtotal}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px; font-size: 14px; color: #555;">Biaya Pengiriman:</td>
                  <td style="padding: 12px; font-size: 14px; color: #333;">${formattedShipping}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px; font-size: 14px; color: #555; font-weight: bold;">Total:</td>
                  <td style="padding: 12px; font-size: 16px; color: #B08968; font-weight: bold;">${formattedTotal}</td>
                </tr>
                </tbody>
            </table>

            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Silakan verifikasi pembayaran dan proses pesanan melalui Dashboard Admin.
            </p>
            <a href="${paymentProofUrl}" target="_blank" style="display: inline-block; 
            background-color: #B08968; color: #ffffff; text-decoration: none; padding: 12px 20px; 
            border-radius: 5px; font-size: 16px; font-weight: bold; margin-top: 10px; margin-right: 10px;">
              Lihat Bukti Pembayaran
            </a>
          </div>
          <div style="background-color: #f7f7f7; color: #888; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Aisya Bakery</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Email notifikasi terkirim ke ${process.env.EMAIL_ADMIN} untuk Order ID ${order.id}`
    );
  } catch (error) {
    console.error("Error mengirim email notifikasi:", error);
  }
};

module.exports = { sendPaymentUploadNotification };