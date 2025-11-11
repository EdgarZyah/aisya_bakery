require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
const port = process.env.PORT || 5000;

// ======================
// 🧰 Middleware
// ======================
app.use(express.json());

// Konfigurasi CORS eksplisit untuk mengizinkan frontend Anda
const corsOptions = {
  // Hanya mengizinkan permintaan dari domain frontend yang Anda deploy
  origin: "https://aisyabakery.site",  
  optionsSuccessStatus: 200, // Untuk kompatibilitas browser lama
};
app.use(cors(corsOptions));

// Menyajikan file statis dari folder 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// 📦 API Routes
// ======================
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/categories", categoryRoutes);

// Root route sederhana untuk test
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ======================
// ⚙️ React Client Setup
// ======================
const clientBuildPath = path.join(__dirname, "client", "dist");
app.use(express.static(clientBuildPath));

// ======================
// 🧭 Wildcard Route (SPA Fallback) - FIX untuk Express 5
// ======================
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ======================
// 💾 Jalankan Server + Sinkron DB
// ======================
db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database sync failed:", err);
  });
