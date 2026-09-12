import React, { useEffect, useState } from "react";

import api from "../utils/api";

import ConfirmDialog from "../components/ConfirmDialog";

import "./AdminFeedback.css";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [schedulingId, setSchedulingId] = useState(null);
  const [deleteFeedbackId, setDeleteFeedbackId] = useState(null);

const [deleteDialog, setDeleteDialog] = useState({
  open: false,
  title: "",
  message: "",
});

  const [sessionForms, setSessionForms] = useState({});

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Okay",
    cancelText: "",
    action: null,
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const closeDialog = () => {
    setDialog({
      open: false,
      title: "",
      message: "",
      confirmText: "Okay",
      cancelText: "",
      action: null,
    });
  };

  const showMessage = (title, message) => {
    setDialog({
      open: true,
      title,
      message,
      confirmText: "Okay",
      cancelText: "",
      action: closeDialog,
    });
  };

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

      showMessage(
        "Update Failed",
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
  const handleDeleteFeedback = (id) => {
  setDeleteFeedbackId(id);

  setDeleteDialog({
    open: true,
    title: "Delete Feedback?",
    message:
      "Are you sure you want to permanently delete this feedback?",
  });
};

const confirmDeleteFeedback = async () => {
  try {
    await api.delete(`/feedback/${deleteFeedbackId}`);

    setFeedbacks((previousFeedbacks) =>
      previousFeedbacks.filter(
        (feedback) => feedback._id !== deleteFeedbackId
      )
    );

    setDeleteFeedbackId(null);

    setDeleteDialog({
      open: false,
      title: "",
      message: "",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);

    setDeleteDialog({
      open: true,
      title: "Delete Failed",
      message:
        error.response?.data?.message ||
        "Failed to delete feedback.",
    });
  }
};

const cancelDeleteFeedback = () => {
  setDeleteFeedbackId(null);

  setDeleteDialog({
    open: false,
    title: "",
    message: "",
  });
};

  const handleScheduleSession = async (id) => {
    const sessionData = sessionForms[id] || {};

    if (
      !sessionData.sessionScheduledAt ||
      !sessionData.sessionMeetingLink
    ) {
      showMessage(
        "Missing Information",
        "Please enter session date, time and meeting link."
      );

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

      showMessage(
        "Session Scheduled",
        "Discussion session scheduled successfully!"
      );
    } catch (error) {
      console.error(
        "Error scheduling discussion session:",
        error
      );

      showMessage(
        "Scheduling Failed",
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
    <>
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
                      <h4>
                        Schedule Discussion Session
                      </h4>

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

                  <div className="feedback-actions">
  <button
    type="button"
    className="delete-feedback-btn"
    onClick={() =>
      handleDeleteFeedback(feedback._id)
    }
  >
    🗑️ Delete Feedback
  </button>
</div>

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

      <ConfirmDialog
        open={dialog.open}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        onConfirm={dialog.action}
        onCancel={closeDialog}
      />
      <ConfirmDialog
  open={deleteDialog.open}
  title={deleteDialog.title}
  message={deleteDialog.message}
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={confirmDeleteFeedback}
  onCancel={cancelDeleteFeedback}
/>
    </>
  );
};

export default AdminFeedback;