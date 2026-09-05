import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./MyFeedbackPage.css";

const MyFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const fetchMyFeedback = async () => {
    try {
      setLoading(true);

      const response = await api.get("/feedback/my");

      setFeedbacks(response.data.feedbacks || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    if (status === "reviewed") {
      return "Reviewed";
    }

    if (status === "session-scheduled") {
      return "Session Scheduled";
    }

    return "Pending";
  };

  if (loading) {
    return (
      <div className="my-feedback-page">
        <Navbar />

        <main className="my-feedback-main">
          <div className="container">
            <h2>Loading your feedback...</h2>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="my-feedback-page">
      <Navbar />

      <main className="my-feedback-main">
        <div className="container">
          <div className="my-feedback-header">
            <p className="my-feedback-eyebrow">
              YOUR FEEDBACK HISTORY
            </p>

            <h1>My Feedback</h1>

            <p>
              View your submitted feedback and check its current status.
            </p>
          </div>

          {feedbacks.length === 0 ? (
            <div className="no-my-feedback">
              <div className="my-feedback-empty-icon">💬</div>

              <h2>No Feedback Submitted Yet</h2>

              <p>
                You have not submitted any course feedback yet.
              </p>
            </div>
          ) : (
            <div className="my-feedback-grid">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="my-feedback-card"
                >
                  <div className="my-feedback-card-top">
                    <div>
                      <h2>
                        {feedback.course?.name || "Course"}
                      </h2>

                      <p className="feedback-submitted-date">
                        Submitted:{" "}
                        {new Date(
                          feedback.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`my-feedback-status ${feedback.status}`}
                    >
                      {getStatusText(feedback.status)}
                    </span>
                  </div>

                  <div className="my-feedback-details">
                    <p>
                      ⭐ <strong>Overall Rating:</strong>{" "}
                      {feedback.rating}/5
                    </p>

                    {feedback.teachingQuality && (
                      <p>
                        👨‍🏫 <strong>Teaching Quality:</strong>{" "}
                        {feedback.teachingQuality}/5
                      </p>
                    )}

                    {feedback.understandingLevel && (
                      <p>
                        📖 <strong>Understanding Level:</strong>{" "}
                        {feedback.understandingLevel}/5
                      </p>
                    )}
                  </div>

                  {feedback.problems && (
                    <div className="my-feedback-section">
                      <h3>Problems Shared</h3>

                      <p>{feedback.problems}</p>
                    </div>
                  )}

                  {feedback.suggestions && (
                    <div className="my-feedback-section">
                      <h3>My Suggestions</h3>

                      <p>{feedback.suggestions}</p>
                    </div>
                  )}

                  {feedback.needsSession &&
                    !feedback.sessionScheduledAt && (
                      <div className="session-pending-info">
                        📅 Your discussion session request is being reviewed.
                      </div>
                    )}

                  {feedback.sessionScheduledAt && (
                    <div className="scheduled-session-student">
                      <h3>📅 Discussion Session Scheduled</h3>

                      <p>
                        <strong>Date & Time:</strong>{" "}
                        {new Date(
                          feedback.sessionScheduledAt
                        ).toLocaleString()}
                      </p>

                      {feedback.sessionNote && (
                        <p>
                          <strong>Note:</strong>{" "}
                          {feedback.sessionNote}
                        </p>
                      )}

                      {feedback.sessionMeetingLink && (
                        <a
                          href={feedback.sessionMeetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="join-session-btn"
                        >
                          Join Discussion Session →
                        </a>
                      )}
                    </div>
                  )}
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

export default MyFeedbackPage;