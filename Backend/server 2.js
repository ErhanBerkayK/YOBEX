require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cartRoutes = require("./routes/cartRoutes");
const cors = require("cors");


const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://yobex.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

connectDB();


/// TUM URUNLERI LISTELEME:
// http://localhost:8000/api/listAllProducts
const productRoutes = require("./routes/listAllProducts.js");
app.use("/api/listAllProducts", productRoutes);

/// YUSUF ROUTES:
app.use(express.json());
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});