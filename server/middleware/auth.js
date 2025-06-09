const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Проверка: передан ли заголовок Authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет токена, доступ запрещён" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Добавим пользователя в req
    next();
  } catch (error) {
    return res.status(401).json({ message: "Недействительный токен" });
  }
};

module.exports = authMiddleware;
