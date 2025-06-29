require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const checkoutRoutes = require("./routes/checkout");
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

///// ROUTES:

/// TUM URUNLERI LISTELEME:
// http://localhost:8000/api/listAllProducts
const productRoutes = require("./routes/listAllProducts.js");
app.use("/api/listAllProducts", productRoutes);

/// id ye GORE BELLIRLI BIR URUNU GORUNTULEME:
// http://localhost:8000/api/getProductById/1
const getProductById = require("./routes/getProductById.js");
app.use("/api/getProductById", getProductById);

/// KATEGORI LISTELEME:
// http://localhost:8000/api/listCategories
const categoryRoutes = require("./routes/listCategories.js");
app.use("/api/listCategories", categoryRoutes);

/// KATEGORIYE GORE URUN FILTRELEME:
// http://localhost:8000/api/filterProductsByCategory?category=Elektronik
const filterByCategoryRoutes = require("./routes/filterProductsByCategory.js");
app.use("/api/filterProductsByCategory", filterByCategoryRoutes);

/// FIYAT ARALIGINA GORE URUN FILTRELEME:
// http://localhost:8000/api/productFilteringByPriceRange?minPrice=100&maxPrice=500
const filterByPriceRoutes = require("./routes/productFilteringByPriceRange.js");
app.use("/api/productFilteringByPriceRange", filterByPriceRoutes);

/// EMRE ROUTES:
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);

/// YUSUF ROUTES:
app.use(express.json());
app.use("/api/cart", cartRoutes);

/// NEW ROUTES FOR FAVORITES, PURCHASE, AND BALANCE:
// Favorites routes
const favoritesRoutes = require("./routes/favorites.js");
app.use("/api/favorites", favoritesRoutes);

// Purchase routes
const purchaseRoutes = require("./routes/purchase.js");
app.use("/api/purchase", purchaseRoutes);

// User balance routes
const userBalanceRoutes = require("./routes/userBalance.js");
app.use("/api/user/balance", userBalanceRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
