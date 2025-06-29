const express=require("express")
const router=express.Router()
const authController = require("../controllers/auth");
const verifyToken = require("../middleware/authMiddleware");

// Kayıt olma
router.post("/register", authController.register);

// Giriş yapma
router.post("/login", authController.login);

// Giriş yapan kullanıcı bilgisi (sadece token varsa çalışır)
router.get("/me", verifyToken, authController.getMe);

// Çıkış yapma 
router.post("/logout",verifyToken,authController.logout)

module.exports=router