const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "success"
    },
    paidAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Checkout", checkoutSchema);