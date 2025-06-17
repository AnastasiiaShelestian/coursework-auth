const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет токена авторизации" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Убедимся, что в req.user будет и id, и email (требуется для /generate-2fa)
    req.user = {
      id: decoded.id || decoded.userId, // fallback для 2FA-подтверждённого токена
      email: decoded.email,
      twoFactorAuthenticated: decoded.twoFactorAuthenticated || false,
    };

    next();
  } catch (err) {
    console.error("Ошибка верификации токена:", err);
    return res.status(401).json({ message: "Невалидный токен" });
  }
};
