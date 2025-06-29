const express =require("express")
const router=express.Router()
const verifyToken=require("../middleware/authMiddleware")
const Order = require("../models/Order");

//Siparişleri listele(sadece giriş yapan kullanıcı görebilir)
/* router.get("/",verifyToken,(req,res)=>{
    res.status(200).json({ message: `Sipariş listesi - Kullanıcı ID: ${req.user.id}` })
})
 */
//Yeni sipariş oluştur
router.post("/", verifyToken, async (req, res) => {
    try {
        const newOrder = new Order({
            userId: req.user.id,
            items: req.body.items || []  // frontend'den ürün listesi bekleniyor
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "Sipariş başarıyla kaydedildi",
            order: savedOrder
        });
    } catch (err) {
        res.status(500).json({ message: "Sipariş kaydı sırasında hata", error: err.message });
    }
});


module.exports = router;