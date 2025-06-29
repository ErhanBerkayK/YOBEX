const express = require("express");
const router = express.Router();
const User = require("../models/model");
const auth = require("../middleware/authMiddleware");

// Get user's current balance
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("balance");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ balance: user.balance || 0 });
  } catch (error) {
    console.error("Error fetching user balance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user balance (for admin purposes or balance top-up)
router.put("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { balance } = req.body;

    if (typeof balance !== "number" || balance < 0) {
      return res.status(400).json({ message: "Invalid balance amount" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance = balance;
    await user.save();

    res.json({ balance: user.balance });
  } catch (error) {
    console.error("Error updating user balance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add balance to user account (for top-ups)
router.post("/add", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance = (user.balance || 0) + amount;
    await user.save();

    res.json({
      balance: user.balance,
      message: `Successfully added $${amount} to your balance`,
    });
  } catch (error) {
    console.error("Error adding balance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get balance history (if needed)
router.get("/history", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    // This would require a separate BalanceHistory model
    // For now, we'll return empty array
    res.json([]);
  } catch (error) {
    console.error("Error fetching balance history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
