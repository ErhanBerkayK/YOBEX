const Cart = require("../models/cart");

// GET /api/cart
exports.getCart = async (req, res) => {
  const userId = req.query.userId;
  const cart = await Cart.findOne({ userId });
  res.json(cart || { userId, items: [] });
};

// POST /api/cart
exports.addItemToCart = async (req, res) => {
  const { userId, item } = req.body;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [item] });
  } else {
    const existingItem = cart.items.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
  }

  await cart.save();
  res.json(cart);
};

// PUT /api/cart/:itemId
exports.updateCartItem = async (req, res) => {
  const { userId, quantity } = req.body;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Sepet bulunamadı" });

  const item = cart.items.id(itemId);
  if (item) {
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } else {
    res.status(404).json({ message: "Ürün bulunamadı" });
  }
};

// DELETE /api/cart/:itemId
exports.removeCartItem = async (req, res) => {
  const { userId } = req.body;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Sepet bulunamadı" });

  cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
  await cart.save();
  res.json(cart);
};

// DELETE /api/cart
exports.clearCart = async (req, res) => {
  const { userId } = req.body;

  const cart = await Cart.findOne({ userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.json({ message: "Sepet temizlendi" });
};
