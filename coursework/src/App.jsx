import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleSuccess from "./components/GoogleSuccess";
import GitHubSuccess from "./components/GitHubSuccess";
import Verify2FA from "./components/Verify2FA";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/google-success" element={<GoogleSuccess />} />
      <Route path="/github-success" element={<GitHubSuccess />} />
      <Route path="/verify-2fa" element={<Verify2FA />} />
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
