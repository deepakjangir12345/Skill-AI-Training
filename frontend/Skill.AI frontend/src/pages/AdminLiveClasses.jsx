import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "./AdminLiveClasses.css";
import ConfirmDialog from "../components/ConfirmDialog";

const AdminLiveClasses = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    
    title: "",
    description: "",
    courseId: "",
    meetingLink: "",
    scheduledAt: "",
    duration: "",
    sessionType: "regular",
  });

  useEffect(() => {
    fetchLiveClasses();
    fetchCourses();
  }, []);

  const [confirmDialog, setConfirmDialog] = useState({
  open: false,
  title: "",
  message: "",
  confirmText: "Okay",
  cancelText: "",
  action: null,
});

  const fetchLiveClasses = async () => {
    try {
      const response = await api.get("/live-classes");
      setLiveClasses(response.data.liveClasses || []);
    } catch (error) {
      console.error("Error fetching live classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data.courses || response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const wasEditing = Boolean(editingId);

    if (wasEditing) {
      await api.put(`/live-classes/${editingId}`, formData);
    } else {
      await api.post("/live-classes", formData);
    }

    setFormData({
      title: "",
      description: "",
      courseId: "",
      meetingLink: "",
      scheduledAt: "",
      duration: "",
      sessionType: "regular",
    });

    setEditingId(null);

    await fetchLiveClasses();

    setConfirmDialog({
      open: true,
      title: wasEditing
        ? "Live Class Updated"
        : "Live Class Created",
      message: wasEditing
        ? "Live class updated successfully."
        : "Live class created successfully.",
      confirmText: "Done",
      cancelText: "",
      action: () => {
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          action: null,
        });
      },
    });
  } catch (error) {
    console.error("Error saving live class:", error);

    setConfirmDialog({
      open: true,
      title: "Unable to Save",
      message:
        error.response?.data?.message ||
        "Failed to save live class.",
      confirmText: "Okay",
      cancelText: "",
      action: () => {
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          action: null,
        });
      },
    });
  }
};

  const handleDelete = async (id) => {
  setConfirmDialog({
    open: true,
    title: "Delete Live Class?",
    message: "Are you sure you want to delete this live class?",
    confirmText: "Delete",
    cancelText: "Cancel",
    action: async () => {
      setConfirmDialog({
        open: false,
        title: "",
        message: "",
        action: null,
      });

      try {
        await api.delete(`/live-classes/${id}`);
        await fetchLiveClasses();

        setConfirmDialog({
          open: true,
          title: "Live Class Deleted",
          message: "Live class deleted successfully.",
          confirmText: "Done",
          cancelText: "",
          action: () => {
            setConfirmDialog({
              open: false,
              title: "",
              message: "",
              action: null,
            });
          },
        });
      } catch (error) {
        setConfirmDialog({
          open: true,
          title: "Delete Failed",
          message:
            error.response?.data?.message ||
            "Failed to delete live class.",
          confirmText: "Okay",
          cancelText: "",
          action: () => {
            setConfirmDialog({
              open: false,
              title: "",
              message: "",
              action: null,
            });
          },
        });
      }
    },
  });
};

  const handleEdit = (liveClass) => {
    setEditingId(liveClass._id);

    setFormData({
      title: liveClass.title || "",
      description: liveClass.description || "",

      courseId:
        liveClass.course?._id ||
        liveClass.course ||
        "",

      meetingLink: liveClass.meetingLink || "",

      scheduledAt: liveClass.scheduledAt
        ? new Date(liveClass.scheduledAt)
            .toISOString()
            .slice(0, 16)
        : "",

      duration: liveClass.duration || "",

      sessionType: liveClass.sessionType || "regular",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="admin-live-classes">
        <div className="live-class-form-section">
          <h2>Loading Live Classes...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-live-classes">
      <h2>Live Class Management</h2>

      {/* CREATE / EDIT FORM */}

      <div className="live-class-form-section">
        <h3>
          {editingId
            ? "Edit Live Class"
            : "Create Live Class"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="live-class-form"
        >
          <input
            type="text"
            name="title"
            placeholder="Live class title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          {/* SESSION TYPE */}

          <select
            name="sessionType"
            value={formData.sessionType}
            onChange={handleChange}
            required
          >
            <option value="regular">
              📚 Regular Live Class
            </option>

            <option value="feedback">
              💬 Student Feedback Session
            </option>
          </select>

          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Course
            </option>

            {courses.map((course) => (
              <option
                key={course._id}
                value={course._id}
              >
                {course.name}
              </option>
            ))}
          </select>

          <input
            type="url"
            name="meetingLink"
            placeholder="Google Meet or Zoom link"
            value={formData.meetingLink}
            onChange={handleChange}
            required
          />

          <input
            type="datetime-local"
            name="scheduledAt"
            value={formData.scheduledAt}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration in minutes"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            required
          />

          <button
            type="submit"
            className="create-live-class-btn"
          >
            {editingId
              ? "Update Live Class"
              : "Create Live Class"}
          </button>
        </form>
        <ConfirmDialog
  open={confirmDialog.open}
  title={confirmDialog.title}
  message={confirmDialog.message}
  confirmText={confirmDialog.confirmText}
  cancelText={confirmDialog.cancelText}
  onConfirm={confirmDialog.action}
  onCancel={() =>
    setConfirmDialog({
      open: false,
      title: "",
      message: "",
      action: null,
    })
  }
/>
      </div>

      {/* LIVE CLASSES LIST */}

      <div className="live-classes-list-section">
        <h3>All Live Classes</h3>

        {liveClasses.length === 0 ? (
          <p>No live classes created yet.</p>
        ) : (
          <div className="live-classes-grid">
            {liveClasses.map((liveClass) => (
              <div
                key={liveClass._id}
                className="live-class-card"
              >
                <h3>{liveClass.title}</h3>

                <p>{liveClass.description}</p>

                <p>
                  <strong>Session Type:</strong>{" "}
                  {liveClass.sessionType === "feedback"
                    ? "💬 Student Feedback Session"
                    : "📚 Regular Live Class"}
                </p>

                <p>
                  <strong>Course:</strong>{" "}
                  {liveClass.course?.name}
                </p>

                <p>
                  <strong>Scheduled:</strong>{" "}
                  {new Date(
                    liveClass.scheduledAt
                  ).toLocaleString()}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {liveClass.duration} minutes
                </p>

                <p className="live-class-status">
  <strong>Status:</strong>{" "}
  <span>{liveClass.status}</span>
</p>

                <div className="live-class-actions">
                  <button
                    type="button"
                    className="edit-live-class-btn"
                    onClick={() =>
                      handleEdit(liveClass)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-live-class-btn"
                    onClick={() =>
                      handleDelete(liveClass._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLiveClasses;