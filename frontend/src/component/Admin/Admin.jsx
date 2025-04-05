import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../Loading/Loading";
import Navbar from "../Navbar/Navbar";
import { useUser } from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "./Admin.css";

const AdminPanel = () => {
  const token = localStorage.getItem("token");
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const [tab, setTab] = useState("createNotice");
  const [loading, setLoading] = useState(false);

  // Form States
  const [noticeData, setNoticeData] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [clubData, setClubData] = useState({
    name: "",
    description: "",
    coordinatorEmail: "",
  });

  // Data
  const [notices, setNotices] = useState([]);
  const [unapprovedEvents, setUnapprovedEvents] = useState([]);

  const { user } = useUser();

  // Fetch notices
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND}/api/notices`);
      setNotices(res.data);
    } catch (err) {
      console.error("Error fetching notices", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unapproved events
  const fetchUnapprovedEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND}/api/events/unapproved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setUnapprovedEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND}/api/notices`,
        { ...noticeData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      setNoticeData({ title: "", content: "", category: "general" });
      toast.success("Notice created");
    } catch (err) {
      toast.error("Error creating notice");
    } finally {
      setLoading(false);
    }
  };

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BACKEND}/api/clubs`, clubData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Club created successfully");
      setClubData({ name: "", description: "", coordinatorEmail: "" });
    } catch (err) {
      toast.error("Error creating club");
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (id) => {
    try {
      await axios.delete(`${BACKEND}/api/notices/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Notice deleted successfully");
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const approveEvent = async (eventId) => {
    try {
      const id = eventId;
      await axios.get(`${BACKEND}/api/events/approve/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Event approved successfully");
      setUnapprovedEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      toast.error("Failed to approve");
    }
  };

  useEffect(() => {
    if (tab === "allNotices") fetchNotices();
    if (tab === "events") fetchUnapprovedEvents();
  }, [tab]);

  return (
    <div className="admin-container">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Admin Panel</h2>
      <p className="admin-subtext">Welcome, {user?.name?.split(" ")[0]} 👋</p>

      <div className="tabs">
        <button
          className={tab === "createNotice" ? "active" : ""}
          onClick={() => setTab("createNotice")}
        >
          📢 Create Notice
        </button>
        <button
          className={tab === "allNotices" ? "active" : ""}
          onClick={() => setTab("allNotices")}
        >
          🗂️ All Notices
        </button>
        <button
          className={tab === "createClub" ? "active" : ""}
          onClick={() => setTab("createClub")}
        >
          🏢 Create Club
        </button>
        <button
          className={tab === "events" ? "active" : ""}
          onClick={() => setTab("events")}
        >
          📅 Approve Events
        </button>
      </div>

      <div className="tab-content">
        {loading && <LoadingSpinner />}

        {tab === "createNotice" && !loading && (
          <form className="admin-form" onSubmit={handleNoticeSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={noticeData.title}
              onChange={(e) =>
                setNoticeData({ ...noticeData, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Content"
              value={noticeData.content}
              onChange={(e) =>
                setNoticeData({ ...noticeData, content: e.target.value })
              }
              required
            />
            <select
              value={noticeData.category}
              onChange={(e) =>
                setNoticeData({ ...noticeData, category: e.target.value })
              }
            >
              <option value="academic">Academic</option>
              <option value="fee">Fee</option>
              <option value="club">Club</option>
              <option value="general">General</option>
            </select>
            <button type="submit">Create Notice</button>
          </form>
        )}

        {tab === "allNotices" && !loading && (
          <div className="list-section">
            {notices.map((n) => (
              <div key={n._id} className="notice-card">
              <div className="notice-header">
                <h4>{n.title}</h4>
                <span className="notice-category">Category: {n.category}</span>
              </div>
              <p className="notice-content">{n.content}</p>
              <div className="notice-footer">
                <button className="delete-btn" onClick={() => deleteNotice(n._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
            
            ))}
          </div>
        )}

        {tab === "createClub" && !loading && (
          <form className="admin-form" onSubmit={handleClubSubmit}>
            <input
              type="text"
              placeholder="Club Name"
              value={clubData.name}
              onChange={(e) =>
                setClubData({ ...clubData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={clubData.description}
              onChange={(e) =>
                setClubData({ ...clubData, description: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Coordinator Email"
              value={clubData.coordinatorEmail}
              onChange={(e) =>
                setClubData({ ...clubData, coordinatorEmail: e.target.value })
              }
              required
            />
            <button type="submit">Create Club</button>
          </form>
        )}

        {tab === "events" && !loading && (
          <div className="list-section">
            {unapprovedEvents.length === 0 ? (
              <p className="empty-message">
                🎉 No pending event approvals. All caught up!
              </p>
            ) : (
              unapprovedEvents.map((event) => (
                <div key={event._id} className="event-card">
                  <div className="event-header">
                    <h4>{event.title}</h4>
                    <span className="event-date-time">
                      {event.date?.slice(0, 10)} at {event.time}
                    </span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-footer">
                    <span className="event-venue">📍 {event.venue}</span>
                    <button
                      className="approve-btn"
                      onClick={() => approveEvent(event._id)}
                    >
                      ✅ Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
