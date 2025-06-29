const express = require("express");
const router = express.Router();
const User = require("../models/model");
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

// Process purchase and deduct balance
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalAmount, items } = req.body;

    // Get user and check balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.balance < totalAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    user.balance -= totalAmount;
    await user.save();

    // Create order
    const order = new Order({
      userId,
      items: items.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
      status: "completed",
      orderDate: new Date(),
    });

    await order.save();

    // Generate order ID
    const orderId = order._id.toString();

    res.json({
      success: true,
      message: "Purchase completed successfully!",
      newBalance: user.balance,
      orderId,
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's purchase history
router.get("/history", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 })
      .populate("items.productId");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific order by ID
router.get("/:orderId", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId }).populate(
      "items.productId"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
