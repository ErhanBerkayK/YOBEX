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


const productRoutes = require("./routes/listAllProducts.js");
app.use("/api/listAllProducts", productRoutes);


const getProductById = require("./routes/getProductById.js");
app.use("/api/getProductById", getProductById);


const categoryRoutes = require("./routes/listCategories.js");
app.use("/api/listCategories", categoryRoutes);


const filterByCategoryRoutes = require("./routes/filterProductsByCategory.js");
app.use("/api/filterProductsByCategory", filterByCategoryRoutes);


const filterByPriceRoutes = require("./routes/productFilteringByPriceRange.js");
app.use("/api/productFilteringByPriceRange", filterByPriceRoutes);


app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);


app.use(express.json());
app.use("/api/cart", cartRoutes);


const favoritesRoutes = require("./routes/favorites.js");
app.use("/api/favorites", favoritesRoutes);


const purchaseRoutes = require("./routes/purchase.js");
app.use("/api/purchase", purchaseRoutes);


const userBalanceRoutes = require("./routes/userBalance.js");
app.use("/api/user/balance", userBalanceRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
