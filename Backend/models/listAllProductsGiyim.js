const mongoose = require("mongoose");

const urunSchema = new mongoose.Schema({
  id: Number,
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  category: String,
  image_url: String,
});

const Giyim = mongoose.model("Giyim", urunSchema, "Giyim");

module.exports = Giyim;
