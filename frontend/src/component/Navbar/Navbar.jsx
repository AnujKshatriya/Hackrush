import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
        IIT Hub
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="hamburger"></span>
        </button>

        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          <div className="nav-center">
          <Link to="/notice">Notice</Link>
          <Link to="/clubs">Clubs</Link>
            {user?.role === "Admin" && <Link to="/admin-panel">Admin</Link>}
            {user?.role === "ClubCoordinator" && <Link to="/club-panel">Club Panel</Link>}
          </div>

          <div className="nav-right">
            <span className="welcome-text">Welcome,
                <span className="welcome-text-name"> {user?.name}</span></span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

