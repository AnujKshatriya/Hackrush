import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Club.css"; // include CSS
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../Navbar/Navbar";


const Club = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(`${BACKEND}/api/clubs`);
        setClubs(res.data);
      } catch (err) {
        console.error("Error fetching clubs", err);
      }
    };

    fetchClubs();
  }, []);

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Navbar />
    <div className="clubs-container">
      <h2 className="page-title">🎓 Clubs</h2>

      <div className="club-list">
        {clubs.map((club) => (
          <div
            key={club._id}
            className={`club-card ${selectedClub?._id === club._id ? "active" : ""}`}
            onClick={() => setSelectedClub(club)}
          >
            <h3>{club.name}</h3>
            <p>{club.description}</p>
          </div>
        ))}
      </div>

      {selectedClub && (
        <div className="club-events">
          <h3 className="section-title">📅 Events by {selectedClub.name}</h3>
          {selectedClub.events.length === 0 ? (
            <p>No events yet for this club.</p>
          ) : (
            selectedClub.events.map((event) => (
              <div className="event-card" key={event._id}>
                <h4>{event.title}</h4>
                {event.posterUrl && (
                    <img
                      src={event.posterUrl}
                      alt={`${event.title} poster`}
                      className="event-poster"
                    />
                  )}
                <p>{event.description}</p>
                <p>
                  📍 {event.venue} | 📅 {new Date(event.date).toLocaleDateString()} ⏰ {event.time}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default Club;
