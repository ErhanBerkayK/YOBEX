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
    const elektronikUrunler = await Elektronik.find({});
    const evEsyalariUrunler = await EvEsyalari.find({});
    const giyimUrunler = await Giyim.find({});
    const kitapUrunler = await Kitap.find({});
    const bebekUrunler = await Bebek.find({});
    const kozmetikUrunler = await Kozmetik.find({});
    const OfisKirtasiyeUrunler = await OfisKirtasiye.find({});
    const oyuncakUrunler = await Oyuncak.find({});
    const sporUrunler = await Spor.find({});

    const tumUrunler = [
      ...elektronikUrunler,
      ...evEsyalariUrunler,
      ...giyimUrunler,
      ...kitapUrunler,
      ...bebekUrunler,
      ...kozmetikUrunler,
      ...OfisKirtasiyeUrunler,
      ...oyuncakUrunler,
      ...sporUrunler,
    ];

    res.json(tumUrunler);
  } catch (error) {
    console.error("Ürünler listelenirken hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
