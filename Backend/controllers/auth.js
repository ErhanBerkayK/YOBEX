const User = require("../models/model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { addToBlacklist } = require("../blacklist");

//REGİSTER FONKSİYONU
exports.register = async (req, res) => {
  console.log("✅ Register isteği alındı");
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }); //mail kontrol
    if (existingUser) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); //parola hash

    const newUser = new User({
      //haslı kullanıcı oluşturma
      username,
      email,
      password: hashedPassword,
      balance: 1000, // Default balance
    });

    await newUser.save();

    // Generate token for auto-login
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_TOKEN, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Kayıt Başarılı",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        balance: newUser.balance,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//LOGİN FONSKİYONU
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      //mail kontrol
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    const isMatch = await bcrypt.compare(password, user.password); //şifre kontrol
    if (!isMatch) {
      return res.status(400).json({ message: "Şifre Yanlış" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//GİRİŞ YAPAN KULLANICININ KENDİ BİLGİLERİNİ GETİR

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı Bulunamadı" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    addToBlacklist(token);
  }

  return res
    .status(200)
    .json({ message: "Çıkış başarılı. Token geçersiz kılındı." });
};
