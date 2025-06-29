const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    id: String,
    title: String,
    price: Number,
    description: String,
    category: String,
    quantity: Number,
});

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    items: [cartItemSchema],
});

module.exports = mongoose.model("Cart", cartSchema);