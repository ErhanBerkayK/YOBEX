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
    const elektronikKategoriler = await Elektronik.distinct("category");
    const evEsyalariKategoriler = await EvEsyalari.distinct("category");
    const giyimKategoriler = await Giyim.distinct("category");
    const kitapKategoriler = await Kitap.distinct("category");
    const bebekKategoriler = await Bebek.distinct("category");
    const kozmetikKategoriler = await Kozmetik.distinct("category");
    const ofisKirtasiyeKategoriler = await OfisKirtasiye.distinct("category");
    const oyuncakKategoriler = await Oyuncak.distinct("category");
    const sporKategoriler = await Spor.distinct("category");

    const tumKategoriler = [
      ...elektronikKategoriler,
      ...evEsyalariKategoriler,
      ...giyimKategoriler,
      ...kitapKategoriler,
      ...bebekKategoriler,
      ...kozmetikKategoriler,
      ...ofisKirtasiyeKategoriler,
      ...oyuncakKategoriler,
      ...sporKategoriler,
    ];

    const benzersizKategoriler = [...new Set(tumKategoriler)];

    res.json(benzersizKategoriler);
  } catch (error) {
    console.error("Kategoriler getirilirken hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
