import React, { useEffect, useState } from "react";

import api from "../utils/api";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import "./LiveClassesPage.css";

const LiveClassesPage = () => {
  const [liveClasses, setLiveClasses] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/live-classes");

      setLiveClasses(response.data.liveClasses || []);
    } catch (error) {
      console.error("Error fetching live classes:", error);

      setLiveClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (id) => {
    try {
      const response = await api.get(`/live-classes/${id}/join`);

      const meetingLink = response.data.meetingLink;

      if (meetingLink) {
        window.location.href = meetingLink;
      }
    } catch (error) {
      console.error("Error joining live class:", error);

      alert(
        error.response?.data?.message ||
          "Unable to join live class"
      );
    }
  };

  const getStatusClass = (status) => {
    if (status === "live") return "status-live";

    if (status === "completed") return "status-completed";

    return "status-upcoming";
  };

  if (loading) {
    return (
      <div className="live-classes-page">
        <Navbar />

        <main className="live-classes-main">
          <div className="container">
            <h2>Loading Live Classes...</h2>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="live-classes-page">
      <Navbar />

      <main className="live-classes-main">
        <div className="container">
          <div className="live-classes-header">
            <p className="live-eyebrow">
              INTERACTIVE LEARNING
            </p>

            <h1>My Live Classes</h1>

            <p>
              View and join live sessions from your enrolled courses.
            </p>
          </div>

          {liveClasses.length === 0 ? (
            <div className="no-live-classes">
              <div className="empty-icon">📺</div>

              <h2>No Live Classes Available</h2>

              <p>
                There are currently no live classes scheduled for your
                enrolled courses.
              </p>
            </div>
          ) : (
            <div className="live-classes-grid">
              {liveClasses.map((liveClass) => (
                <div
                  key={liveClass._id}
                  className="live-class-card"
                >
                  <div className="live-class-top">
                    <span
                      className={`status-badge ${getStatusClass(
                        liveClass.status
                      )}`}
                    >
                      {liveClass.status === "live"
                        ? "🔴 LIVE NOW"
                        : liveClass.status === "completed"
                        ? "✓ COMPLETED"
                        : "📅 UPCOMING"}
                    </span>
                  </div>

                  <div className="live-class-content">
                    <h2>{liveClass.title}</h2>

                    <p className="live-class-description">
                      {liveClass.description ||
                        "Join this interactive live learning session."}
                    </p>

                    <div className="live-class-details">
                      <p>
                        📚 <strong>Course:</strong>{" "}
                        {liveClass.course?.name || "Course"}
                      </p>

                      <p>
                        🕒 <strong>Date & Time:</strong>{" "}
                        {new Date(
                          liveClass.scheduledAt
                        ).toLocaleString()}
                      </p>

                      <p>
                        ⏱️ <strong>Duration:</strong>{" "}
                        {liveClass.duration} minutes
                      </p>
                    </div>

                    {liveClass.status === "live" ? (
                      <button
                        className="join-class-btn"
                        onClick={() =>
                          handleJoinClass(liveClass._id)
                        }
                      >
                        Join Live Class →
                      </button>
                    ) : liveClass.status === "upcoming" ? (
                      <button
                        className="join-class-btn disabled-btn"
                        disabled
                      >
                        Class Not Started Yet
                      </button>
                    ) : (
                      <button
                        className="join-class-btn disabled-btn"
                        disabled
                      >
                        Class Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LiveClassesPage;