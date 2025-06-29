const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const auth = require("../middleware/authMiddleware");

// Get user's favorites
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.findOne({ userId }).populate(
      "items.productId"
    );

    if (!favorites) {
      return res.json({
        userId,
        items: [],
      });
    }

    // Transform items to match frontend format
    const transformedItems = favorites.items.map((item) => ({
      _id: item._id,
      id: item.productId._id.toString(),
      title: item.productId.title,
      price: item.productId.price,
      description: item.productId.description,
      category: item.productId.category,
      image_url: item.productId.image_url,
      rating: item.productId.rating,
    }));

    res.json({
      userId,
      items: transformedItems,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add product to favorites
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      productId,
      title,
      price,
      description,
      category,
      image_url,
      rating,
    } = req.body;

    // Check if product already exists in favorites
    let favorites = await Favorite.findOne({ userId });

    if (!favorites) {
      // Create new favorites document
      favorites = new Favorite({
        userId,
        items: [
          {
            productId,
            title,
            price,
            description,
            category,
            image_url,
            rating,
          },
        ],
      });
    } else {
      // Check if product already exists
      const existingItem = favorites.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        return res
          .status(400)
          .json({ message: "Product already in favorites" });
      }

      // Add new item
      favorites.items.push({
        productId,
        title,
        price,
        description,
        category,
        image_url,
        rating,
      });
    }

    await favorites.save();

    // Return updated favorites
    const updatedFavorites = await Favorite.findOne({ userId }).populate(
      "items.productId"
    );

    const transformedItems = updatedFavorites.items.map((item) => ({
      _id: item._id,
      id: item.productId._id.toString(),
      title: item.productId.title,
      price: item.productId.price,
      description: item.productId.description,
      category: item.productId.category,
      image_url: item.productId.image_url,
      rating: item.productId.rating,
    }));

    res.json({
      userId,
      items: transformedItems,
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove product from favorites
router.delete("/:itemId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const favorites = await Favorite.findOne({ userId });

    if (!favorites) {
      return res.status(404).json({ message: "Favorites not found" });
    }

    // Remove item by _id
    favorites.items = favorites.items.filter(
      (item) => item._id.toString() !== itemId
    );

    await favorites.save();

    // Return updated favorites
    const updatedFavorites = await Favorite.findOne({ userId }).populate(
      "items.productId"
    );

    const transformedItems = updatedFavorites.items.map((item) => ({
      _id: item._id,
      id: item.productId._id.toString(),
      title: item.productId.title,
      price: item.productId.price,
      description: item.productId.description,
      category: item.productId.category,
      image_url: item.productId.image_url,
      rating: item.productId.rating,
    }));

    res.json({
      userId,
      items: transformedItems,
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Clear all favorites
router.delete("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await Favorite.findOneAndDelete({ userId });

    res.json({
      userId,
      items: [],
    });
  } catch (error) {
    console.error("Error clearing favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
