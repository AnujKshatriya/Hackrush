import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>EventHub @ IITGN</h1>
        <p style={styles.subheading}>Seamlessly manage events, clubs, and communities.</p>

        <div style={styles.featureList}>
          <p>🎯 Explore and register for events</p>
          <p>👥 Manage clubs and members</p>
          <p>📅 Sync with your Google Calendar</p>
        </div>

        <div style={styles.notice}>
          <p>
            <strong>Login using your IITGN Email</strong> (@iitgn.ac.in)
          </p>
        </div>

        <button style={styles.loginBtn} onClick={handleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={styles.googleIcon}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "2rem",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "0.5rem",
  },
  subheading: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "1.5rem",
  },
  featureList: {
    textAlign: "left",
    color: "#333",
    fontSize: "0.95rem",
    marginBottom: "2rem",
    width: "100%",
    lineHeight: "1.6",
  },
  notice: {
    marginBottom: "1rem",
    fontSize: "0.9rem",
    color: "#444",
  },
  loginBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    backgroundColor: "#ffffff",
    border: "1.5px solid #ddd",
    borderRadius: "12px",
    padding: "12px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    width: "100%",
    maxWidth: "320px",
  },
  googleIcon: {
    width: "22px",
    height: "22px",
  },
};

export default Login;
