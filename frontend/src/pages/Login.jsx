import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 Checking token in localStorage:", token);

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎉 EventHub @ IITGN</h1>
        <p style={styles.tagline}>
          Your one-stop solution for managing events, clubs, and communities at IITGN.
        </p>

        <ul style={styles.features}>
          <li>✅ Discover and register for campus events</li>
          <li>✅ Manage your clubs and members efficiently</li>
          <li>✅ Get reminders and sync with your Google Calendar</li>
        </ul>

        <div style={styles.footer}>
          <p style={{ marginBottom: "20px" }}>
            <strong>Login only with IITGN Email</strong> (@iitgn.ac.in)
          </p>
          <button style={styles.googleButton} onClick={handleLogin}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              style={styles.googleIcon}
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "40px 30px",
    maxWidth: "550px",
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: {
    fontSize: "36px",
    marginBottom: "10px",
    color: "#333",
  },
  tagline: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "25px",
  },
  features: {
    textAlign: "left",
    marginBottom: "40px",
    paddingLeft: "20px",
    color: "#444",
    lineHeight: "1.8",
    fontSize: "16px",
  },
  footer: {
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#ffffff",
    border: "2px solid #ccc",
    borderRadius: "10px",
    padding: "15px 30px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    transition: "0.3s ease",
    margin: "0 auto",
    width: "80%",
    maxWidth: "350px",
  },
  googleIcon: {
    width: "24px",
    height: "24px",
  },
};

export default Login;
