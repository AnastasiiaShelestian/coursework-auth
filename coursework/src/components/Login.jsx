import axios from "axios";
import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Link,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Неверный email или пароль");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#354f52",
        backgroundImage:
          "url(https://u-stena.ru/upload/iblock/5ea/5ea640f9c5cadfed58a52a6d53d2e142.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "centr",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        sx={{
          height: 500,
          width: 400,
          marginTop: 5,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: 5,
          background:
            "linear-gradient(135deg, rgba(26, 62, 34, 0.6) 0%, rgba(33, 94, 64, 0.6) 100%)",
          backdropFilter: "blur(7px)",
          WebkitBackdropFilter: "blur(7px)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            sx={{ width: "80%", margin: "0 auto ", mt: 0 }}
          >
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
              Авторизация
            </Typography>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Пароль"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button variant="contained" color="primary" type="submit">
              Войти
            </Button>
            <a href="http://localhost:5000/api/auth/google">
              <Button variant="contained" color="primary">
                Войти через Google
              </Button>
            </a>

            <Typography variant="body3" sx={{ color: "#dad7cd" }}>
              Нет аккаунта?{" "}
              <Link component="button" onClick={() => navigate("/register")}>
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>
        </form>
      </Container>
    </Box>
  );
}

export default Login;
