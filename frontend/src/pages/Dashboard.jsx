import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import LoadingSpinner from "../component/Loading/Loading.jsx";
import Navbar from "../component/Navbar/Navbar.jsx";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refetchUser, loading, user } = useUser();

  const [notices, setNotices] = useState([]);
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("All");
  const [dataLoading, setDataLoading] = useState(true);

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  // Auth Redirect Check
  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(location.search).get("token");
    const tokenInStorage = localStorage.getItem("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      refetchUser();
      navigate("/dashboard", { replace: true });
    } else if (!tokenInStorage) {
      navigate("/", { replace: true });
    }
  }, [location, navigate, refetchUser]);

  // Fetch Notices
  const fetchNotices = async () => {
    const res = await axios.get(`${BACKEND}/api/notices`);
    const reversed = res.data.reverse();
    setNotices(reversed);
  };

  // Fetch Events
  const fetchEvents = async () => {
    const res = await axios.get(`${BACKEND}/api/events`);
    console.log(res)
    const sortedEvents = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));

    setEvents(sortedEvents);
    setFilteredEvents(sortedEvents);
  };


  // Fetch Clubs
  const fetchClubs = async () => {
    const res = await axios.get(`${BACKEND}/api/clubs`);
    setClubs(res.data);
  };

  // Fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchNotices(),
          fetchEvents(),
          fetchClubs()
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClubChange = (e) => {
    const selected = e.target.value;
    setSelectedClub(selected);
    if (selected === "All") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => event.club.name === selected));
    }
  };



  const handleRSVP = async (eventId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${BACKEND}/api/events/rsvp/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Successfully registered for the event!");
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.message === "Already registered"
      ) {
        toast.info("You’ve already registered for this event.");
      } else {
        toast.error("RSVP failed. Try again.");
      }
    }
  };



  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading || dataLoading || !user) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="dashboard-container">
        <section className="section">
          <h2 className="section-title">📌 Notice Board</h2>
          <div className="grid-container">
            {(showAllNotices ? notices : notices.slice(0, 6)).map((notice) => (
              <div className="card" key={notice._id}>
                <h3 className="card-title">{notice.title}</h3>
                <p className="card-content">{notice.content}</p>
              </div>
            ))}
          </div>
          {notices.length > 6 && (
            <button
              className="btn-outline center-btn"
              onClick={() => setShowAllNotices(!showAllNotices)}
            >
              {showAllNotices ? "Show Less" : "More Notices"}
            </button>
          )}
        </section>

        <section className="section">
          <h2 className="section-title">🎉 Events</h2>
          <div className="filter-bar">
            <label htmlFor="clubFilter">Filter by Club:</label>
            <select
              id="clubFilter"
              value={selectedClub}
              onChange={handleClubChange}
            >
              <option value="All">All Clubs</option>
              {clubs.map((club) => (
                <option value={club.name} key={club._id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          {filteredEvents.length === 0 ? (
            <p>No events for this club.</p>
          ) : (
            <div className="events-container">
              {filteredEvents.map((event) => (
                <div className="event-card" key={event._id}>
                  <h3 className="card-title">{event.title}</h3>
                  <p className="card-content">{event.description}</p>
                  <p className="meta">
                    📍 {event.venue} | 📅 {event.date} ⏰ {event.time}
                  </p>
                  <div className="event-footer">
                    <p className="tag">🎯 {event.club?.name || "Unknown Club"}</p>
                    <button
                      className="btn-outline"
                      onClick={() => handleRSVP(event._id)}
                    >
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>

          )}
        </section>


      </div>
    </>
  );
};

export default Dashboard
