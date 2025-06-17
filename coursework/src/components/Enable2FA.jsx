import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Enable2FA = ({ onSuccess }) => {
  const [qrCode, setQrCode] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 — кнопка, 2 — отображение QR

  const fetchQRCode = async () => {
    setLoading(true);
    setStatus("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/auth/generate-2fa",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQrCode(res.data.qrCode);
      setStep(2);
    } catch (error) {
      console.error(error);
      setStatus("Не удалось получить QR-код");
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    setStatus("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/auth/enable-2fa",
        { code },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus("✅ Двухфакторная аутентификация включена");
      if (onSuccess) onSuccess();
    } catch (error) {
      setStatus(error.response?.data?.message || "Ошибка при включении 2FA");
    }
  };

  return (
    <Box textAlign="center">
      {step === 1 && (
        <Button variant="contained" onClick={fetchQRCode}>
          Получить QR-код
        </Button>
      )}

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {step === 2 && !loading && (
        <>
          <img
            src={qrCode}
            alt="QR Code"
            style={{ width: 200, marginTop: 10 }}
          />
          <Typography variant="body2" mt={2}>
            Отсканируйте QR-код и введите код из приложения:
          </Typography>
          <TextField
            label="Код"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" onClick={handleEnable} sx={{ mt: 2 }}>
            Подтвердить
          </Button>
        </>
      )}

      {status && (
        <Typography mt={2} color={status.startsWith("✅") ? "green" : "error"}>
          {status}
        </Typography>
      )}
    </Box>
  );
};

export default Enable2FA;
