const express=require("express")
const router = express.Router()
const verifyToken=require("../middleware/authMiddleware")
const Checkout = require("../models/Checkout");

//Checkout işlemi
router.post("/", verifyToken, async (req, res) => {
    try {
        const newCheckout = new Checkout({
            userId: req.user.id,
            orderId: req.body.orderId,           // frontend’den order ID bekliyoruz
            paymentStatus: "success",             // şimdilik hep başarılı kabul ediyoruz
            paidAt: new Date()
        });

        const savedCheckout = await newCheckout.save();

        res.status(201).json({
            message: "Ödeme kaydı başarıyla oluşturuldu",
            checkout: savedCheckout
        });
    } catch (err) {
        res.status(500).json({ message: "Ödeme kaydı sırasında hata", error: err.message });
    }
});


module.exports = router;