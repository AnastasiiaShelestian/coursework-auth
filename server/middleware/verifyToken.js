const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет токена авторизации" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      twoFactorAuthenticated: decoded.twoFactorAuthenticated || false,
    };

    next();
  } catch (err) {
    console.error("Ошибка верификации токена:", err);
    return res.status(401).json({ message: "Невалидный токен" });
  }
};
