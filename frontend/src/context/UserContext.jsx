import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, email, role }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ User fetched:", data);
        setUser(data); // { name, email, role }
      } else {
        console.warn("⛔ Token invalid, logging out:", data.message);
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (err) {
      console.error("⚠️ Error fetching user:", err);
      localStorage.removeItem("token");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refetchUser: fetchUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
