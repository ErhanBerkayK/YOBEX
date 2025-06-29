const express = require("express");
const router = express.Router();

const Elektronik = require("../models/listAllProductsElektronik.js");
const EvEsyalari = require("../models/listAllProductsEvEsyalari.js");
const Giyim = require("../models/listAllProductsGiyim.js");
const Kitap = require("../models/listAllProductsKitap.js");
const Bebek = require("../models/listAllProductsBebekUrunleri.js");
const Kozmetik = require("../models/listAllProductsKozmetik.js");
const OfisKirtasiye = require("../models/listAllProductsOfisKirtasiye.js");
const Oyuncak = require("../models/listAllProductsOyuncak.js");
const Spor = require("../models/listAllProductsSpor.js");

router.get("/", async (req, res) => {
  try {
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ message: "Geçerli bir fiyat aralığı girin." });
    }

    const elektronik = await Elektronik.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    const evEsyalari = await EvEsyalari.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    const giyim = await Giyim.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    const kitap = await Kitap.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    const bebek = await Bebek.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    const kozmetik = await Kozmetik.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    const ofisKirtasiye = await OfisKirtasiye.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    const oyuncak = await Oyuncak.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    const spor = await Spor.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    const urunler = [...elektronik, ...evEsyalari, ...giyim, ...kitap, ...bebek, ...kozmetik, ...ofisKirtasiye, ...oyuncak, ...spor];

    res.json(urunler);
  } catch (error) {
    console.error("Fiyata göre ürün filtreleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
