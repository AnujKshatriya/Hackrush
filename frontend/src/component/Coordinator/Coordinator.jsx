import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Coordinator.css";

const CoordinatorPanel = () => {
  const token = localStorage.getItem("token");
  const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    posterUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // Replace with yours

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      formData
    );
    if (res.status !== 200) {
      toast.error("Error uploading image to Cloudinary");
      throw new Error("Error uploading image to Cloudinary");
    }
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let posterUrl = eventData.posterUrl;

      if (imageFile) {
        const uploadedUrl = await uploadToCloudinary(imageFile);
        posterUrl = uploadedUrl;
      }

      const res = await axios.post(`${BACKEND}/api/events`, { ...eventData, posterUrl },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
  
      toast.success("Event created successfully!");
      setEventData({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        category: "",
        posterUrl: "",
      });
      setImageFile(null);
  
    } catch (err) {
      console.error(err);
      toast.error("Error creating event");
    }
    setLoading(false);
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="coordinator-panel">
        <h2>Create Event</h2>
        <form
          onSubmit={handleSubmit}
          className="event-form"
          encType="multipart/form-data"
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={eventData.venue}
            onChange={handleChange}
            required
          />
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            value={eventData.category}
            onChange={handleChange}
            className="event-dropdown"
            required
          >
            <option value="" disabled>Select Category</option>
            <option value="technical">Technical</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="academic">Academic</option>
          </select>

          <label htmlFor="poster-upload" className="poster-label">
            Upload Poster
          </label>
          <input
            id="poster-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CoordinatorPanel;
