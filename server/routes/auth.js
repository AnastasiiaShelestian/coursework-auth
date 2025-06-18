const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const verifyToken = require("../middleware/verifyToken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const passport = require("passport");

const router = express.Router();

// Регистрация
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "Регистрация успешна" });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Логин
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }
    //Временный токин
    if (user.twoFactorEnabled) {
      const tempToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
      );

      return res.json({
        message: "Требуется подтверждение 2FA",
        token: tempToken,
        twoFactor: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          twoFactorEnabled: true,
        },
      });
    }
    //постоянный токин
    const token = jwt.sign(
      { id: user._id, email: user.email, twoFactorAuthenticated: true },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "2FA подтверждена успешно",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  res.json({
    message: "Добро пожаловать в защищённый профиль!",
    user: req.user,
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const { token, user } = req.user;

    res.redirect(
      `http://localhost:5173/google-success?token=${token}&name=${user.name}&email=${user.email}`
    );
  }
);

// Вход через GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Callback от GitHub
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const { token, user } = req.user;
    res.redirect(
      `http://localhost:5173/github-success?token=${token}&name=${user.name}&email=${user.email}`
    );
  }
);

// Защищённый маршрут для генерации 2FA
router.get("/generate-2fa", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const secret = speakeasy.generateSecret({
      name: `MyApp (${req.user.email})`,
    });

    const user = await User.findById(userId);
    user.twoFactorSecret = secret.base32;
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err)
        return res.status(500).json({ message: "Ошибка генерации QR-кода" });

      res.json({ qrCode: data_url });
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
});

router.post("/verify-2fa", verifyToken, async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: "2FA не настроена" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1, // допускаем ±30 секунд
    });

    if (!verified) {
      return res.status(401).json({ message: "Неверный код 2FA" });
    }

    // Создаём токен с пометкой, что 2FA подтверждено
    const token = jwt.sign(
      { userId: user._id, email: user.email, twoFactorAuthenticated: true },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "2FA подтверждена успешно",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        twoFactorEnabled: true,
      },
    });
  } catch (error) {
    console.error("Ошибка при верификации 2FA:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Включение двухфакторной аутентификации после подтверждения кода
router.post("/enable-2fa", verifyToken, async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: "2FA не настроена" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({ message: "Неверный код подтверждения" });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: "Двухфакторная аутентификация включена" });
  } catch (error) {
    console.error("Ошибка включения 2FA:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
