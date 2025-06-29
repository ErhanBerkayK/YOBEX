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
    const kategori = req.query.category;

    const elektronik = await Elektronik.find(kategori ? { category: kategori } : {});
    const evEsyalari = await EvEsyalari.find(kategori ? { category: kategori } : {});
    const giyim = await Giyim.find(kategori ? { category: kategori } : {});
    const kitap = await Kitap.find(kategori ? { category: kategori } : {});
    const bebek = await Bebek.find(kategori ? { category: kategori } : {});
    const kozmetik = await Kozmetik.find(kategori ? { category: kategori } : {});
    const ofisKirtasiye = await OfisKirtasiye.find(kategori ? { category: kategori } : {});
    const oyuncak = await Oyuncak.find(kategori ? { category: kategori } : {});
    const spor = await Spor.find(kategori ? { category: kategori } : {});

    const urunler = [...elektronik, ...evEsyalari, ...giyim, ...kitap, ...bebek, ...kozmetik, ...ofisKirtasiye, ...oyuncak, ...spor];

    res.json(urunler);
  } catch (error) {
    console.error("Kategoriye göre ürün filtreleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
