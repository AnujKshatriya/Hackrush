import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(location.search).get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      navigate("/dashboard", { replace: true });
    }
  }, [location, navigate]);

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Dashboard</h2>
      <p>You're logged in ✅</p>
      <p>Token (shortened): {token?.slice(0, 30)}...</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
