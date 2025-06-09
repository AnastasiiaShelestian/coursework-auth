import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#354f52",
        backgroundImage:
          "url(https://u-stena.ru/upload/iblock/5ea/5ea640f9c5cadfed58a52a6d53d2e142.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        sx={{
          position: "relative",
          height: 400,
          width: 400,
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
          padding: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "#fff", fontWeight: "bold", mb: 2 }}
        >
          Добро пожаловать!
        </Typography>
        <Typography variant="body1" sx={{ color: "#dad7cd", mb: 1 }}>
          Имя: {user?.name}
        </Typography>
        <Typography variant="body1" sx={{ color: "#dad7cd" }}>
          Email: {user?.email}
        </Typography>
        <Button variant="contained" onClick={handleLogout} color="primary">
          Выйти из аккаунта
        </Button>
      </Container>
    </Box>
  );
}

export default Profile;
