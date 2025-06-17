import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function GitHubSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const name = query.get("name");
    const email = query.get("email");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          email,
          github: true, // 💡 для отображения в профиле
        })
      );
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>Вход через GitHub... Пожалуйста, подождите...</div>;
}

export default GitHubSuccess;
