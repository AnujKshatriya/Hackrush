import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import LoadingSpinner from "../component/Loading/Loading.jsx";
import Navbar from "../component/Navbar/Navbar.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refetchUser, loading, user } = useUser();

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(location.search).get("token");
    const tokenInStorage = localStorage.getItem("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      refetchUser(); // fetch fresh user data
      navigate("/dashboard", { replace: true });
    } else if (!tokenInStorage) {
      navigate("/", { replace: true });
    }
  }, [location, navigate, refetchUser]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading || !user) return <LoadingSpinner />;

  return (
    <div>
      <Navbar/>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name} ({user.role}) ✅</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
