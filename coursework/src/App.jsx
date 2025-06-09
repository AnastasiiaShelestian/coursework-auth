import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleSuccess from "./components/GoogleSuccess";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/google-success" element={<GoogleSuccess />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
