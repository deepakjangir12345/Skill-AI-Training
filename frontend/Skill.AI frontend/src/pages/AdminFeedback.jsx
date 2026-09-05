import React, { useEffect, useState } from "react";

import api from "../utils/api";

import "./AdminFeedback.css";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [schedulingId, setSchedulingId] = useState(null);

  const [sessionForms, setSessionForms] = useState({});

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);

      const response = await api.get("/feedback/admin/all");

      setFeedbacks(response.data.feedbacks || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);

      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);

      await api.put(`/feedback/${id}/status`, {
        status,
      });

      setFeedbacks((previousFeedbacks) =>
        previousFeedbacks.map((feedback) =>
          feedback._id === id
            ? {
                ...feedback,
                status,
              }
            : feedback
        )
      );
    } catch (error) {
      console.error("Error updating feedback status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update feedback status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSessionFormChange = (id, field, value) => {
    setSessionForms((previousForms) => ({
      ...previousForms,
      [id]: {
        ...previousForms[id],
        [field]: value,
      },
    }));
  };

  const handleScheduleSession = async (id) => {
    const sessionData = sessionForms[id] || {};

    if (
      !sessionData.sessionScheduledAt ||
      !sessionData.sessionMeetingLink
    ) {
      alert("Please enter session date, time and meeting link");

      return;
    }

    try {
      setSchedulingId(id);

      const response = await api.put(
        `/feedback/${id}/schedule-session`,
        {
          sessionScheduledAt:
            sessionData.sessionScheduledAt,

          sessionMeetingLink:
            sessionData.sessionMeetingLink,

          sessionNote:
            sessionData.sessionNote || "",
        }
      );

      const updatedFeedback =
        response.data.feedback;

      setFeedbacks((previousFeedbacks) =>
        previousFeedbacks.map((feedback) =>
          feedback._id === id
            ? updatedFeedback
            : feedback
        )
      );

      setSessionForms((previousForms) => {
        const updatedForms = { ...previousForms };

        delete updatedForms[id];

        return updatedForms;
      });

      alert("Discussion session scheduled successfully!");
    } catch (error) {
      console.error(
        "Error scheduling discussion session:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to schedule discussion session"
      );
    } finally {
      setSchedulingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-feedback">
        <h2>Loading Feedback...</h2>
      </div>
    );
  }

  return (
    <div className="admin-feedback">
      <div className="admin-feedback-header">
        <div>
          <h2>Student Feedback</h2>

          <p>
            Review student learning experience, problems and
            suggestions.
          </p>
        </div>

        <div className="feedback-count">
          Total: {feedbacks.length}
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="no-feedback">
          <div className="feedback-empty-icon">
            💬
          </div>

          <h3>No Feedback Available</h3>

          <p>
            Students have not submitted any feedback yet.
          </p>
        </div>
      ) : (
        <div className="admin-feedback-grid">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="admin-feedback-card"
            >
              <div className="feedback-card-top">
                <div>
                  <h3>
                    {feedback.user?.name || "Student"}
                  </h3>

                  <p className="student-email">
                    {feedback.user?.email || ""}
                  </p>
                </div>

                <span className="feedback-status">
                  {feedback.status}
                </span>
              </div>

              <div className="feedback-info">
                <p>
                  📚 <strong>Course:</strong>{" "}
                  {feedback.course?.name || "Course"}
                </p>

                <p>
                  ⭐ <strong>Overall Rating:</strong>{" "}
                  {feedback.rating}/5
                </p>

                <p>
                  👨‍🏫 <strong>Teaching Quality:</strong>{" "}
                  {feedback.teachingQuality
                    ? `${feedback.teachingQuality}/5`
                    : "Not provided"}
                </p>

                <p>
                  📖 <strong>Understanding Level:</strong>{" "}
                  {feedback.understandingLevel
                    ? `${feedback.understandingLevel}/5`
                    : "Not provided"}
                </p>
              </div>

              {feedback.problems && (
                <div className="feedback-section">
                  <h4>Student Problems</h4>

                  <p>{feedback.problems}</p>
                </div>
              )}

              {feedback.suggestions && (
                <div className="feedback-section">
                  <h4>Suggestions</h4>

                  <p>{feedback.suggestions}</p>
                </div>
              )}

              {feedback.needsSession && (
                <div className="session-request">
                  📅 Student requested a discussion session
                </div>
              )}

              <div className="feedback-status-update">
                <label>
                  <strong>Update Status</strong>
                </label>

                <select
                  value={feedback.status || "pending"}
                  onChange={(event) =>
                    handleStatusChange(
                      feedback._id,
                      event.target.value
                    )
                  }
                  disabled={
                    updatingId === feedback._id ||
                    schedulingId === feedback._id
                  }
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="reviewed">
                    Reviewed
                  </option>

                  <option value="session-scheduled">
                    Session Scheduled
                  </option>
                </select>

                {updatingId === feedback._id && (
                  <p className="updating-status">
                    Updating...
                  </p>
                )}
              </div>

              {feedback.needsSession &&
  feedback.status !== "session-scheduled" && (
                <div className="schedule-session-section">
                  <h4>Schedule Discussion Session</h4>

                  <input
                    type="datetime-local"
                    value={
                      sessionForms[feedback._id]
                        ?.sessionScheduledAt || ""
                    }
                    onChange={(event) =>
                      handleSessionFormChange(
                        feedback._id,
                        "sessionScheduledAt",
                        event.target.value
                      )
                    }
                    disabled={
                      schedulingId === feedback._id
                    }
                  />

                  <input
                    type="url"
                    placeholder="Google Meet or Zoom link"
                    value={
                      sessionForms[feedback._id]
                        ?.sessionMeetingLink || ""
                    }
                    onChange={(event) =>
                      handleSessionFormChange(
                        feedback._id,
                        "sessionMeetingLink",
                        event.target.value
                      )
                    }
                    disabled={
                      schedulingId === feedback._id
                    }
                  />

                  <textarea
                    placeholder="Optional note for student"
                    value={
                      sessionForms[feedback._id]
                        ?.sessionNote || ""
                    }
                    onChange={(event) =>
                      handleSessionFormChange(
                        feedback._id,
                        "sessionNote",
                        event.target.value
                      )
                    }
                    disabled={
                      schedulingId === feedback._id
                    }
                  />

                  <button
                    type="button"
                    className="schedule-session-btn"
                    onClick={() =>
                      handleScheduleSession(
                        feedback._id
                      )
                    }
                    disabled={
                      schedulingId === feedback._id
                    }
                  >
                    {schedulingId === feedback._id
                      ? "Scheduling..."
                      : "Schedule Session"}
                  </button>
                </div>
              )}

              {feedback.status ===
                "session-scheduled" &&
                feedback.sessionScheduledAt && (
                  <div className="scheduled-session-info">
                    <h4>📅 Session Scheduled</h4>

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
                  </div>
                )}

              <div className="feedback-date">
                Submitted:{" "}
                {new Date(
                  feedback.createdAt
                ).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;