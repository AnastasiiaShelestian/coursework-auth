const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("./config/passport");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Успешное подключение к MongoDB");

    app.listen(process.env.PORT, () => {
      console.log(`Сервер запущен на http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Ошибка подключения к БД:", error.message);
  }
};

start();
