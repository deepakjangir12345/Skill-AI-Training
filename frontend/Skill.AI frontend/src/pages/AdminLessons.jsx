import { useState, useEffect } from "react";
import api from "../utils/api";
import "./AdminLessons.css";
import ConfirmDialog from "../components/ConfirmDialog";

const emptyForm = {
  title: "",
  description: "",
  videoUrl: "",
  pdfUrl: "",
  duration: "",
  order: "",
  isPreview: false,
  module: "",
};

const AdminLessons = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "", order: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [savingLesson, setSavingLesson] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
  open: false,
  title: "",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  action: null,
});

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      const res = await api.get(`/lessons/${courseId}`);
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.log("Fetch lessons error:", err);
      setLessons([]);
    }
  };

  const fetchModules = async (courseId) => {
    try {
      const res = await api.get(`/modules/course/${courseId}`);
      setModules(res.data.modules || []);
    } catch (err) {
      console.log("Fetch modules error:", err);
      setModules([]);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingLessonId(null);
    setVideoFile(null);
    setPdfFile(null);
    setUploadProgress(0);
  };

  const resetModuleForm = () => {
    setModuleForm({ title: "", description: "", order: "" });
    setEditingModuleId(null);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEdit = (lesson) => {
    setEditingLessonId(lesson._id);
    setFormData({
      title: lesson.title || "",
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      pdfUrl: lesson.pdfUrl || "",
      duration: lesson.duration ?? "",
      order: lesson.order ?? "",
      isPreview: Boolean(lesson.isPreview),
      module: lesson.module?._id || lesson.module || "",
    });
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const payload = {
      title: moduleForm.title,
      description: moduleForm.description,
      order: Number(moduleForm.order),
      course: selectedCourse,
    };

    try {
      if (editingModuleId) {
        await api.put(`/modules/${editingModuleId}`, payload);
      } else {
        await api.post("/modules", payload);
      }
      await fetchModules(selectedCourse);
      resetModuleForm();
    } catch (err) {
      setConfirmDialog({
  open: true,
  title: "Module Save Failed",
  message: err.response?.data?.message || err.message,
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

  const handleEditModule = (module) => {
    setEditingModuleId(module._id);
    setModuleForm({
      title: module.title || "",
      description: module.description || "",
      order: module.order ?? "",
    });
  };

  const handleDeleteModule = async (moduleId) => {
  setConfirmDialog({
    open: true,
    title: "Delete Module?",
    message: "Modules with lessons cannot be deleted.",
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
        await api.delete(`/modules/${moduleId}`);
        await fetchModules(selectedCourse);

        setConfirmDialog({
          open: true,
          title: "Module Deleted",
          message: "Module deleted successfully.",
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
      } catch (err) {
        setConfirmDialog({
          open: true,
          title: "Unable to Delete Module",
          message:
            err.response?.data?.message ||
            err.message ||
            "Failed to delete module.",
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

  const handleDelete = async (lessonId) => {
  setConfirmDialog({
    open: true,
    title: "Delete Lesson?",
    message: "Are you sure you want to delete this lesson?",
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
        await api.delete(`/lessons/${lessonId}`);

        if (editingLessonId === lessonId) {
          resetForm();
        }

        await fetchLessons(selectedCourse);

        setConfirmDialog({
          open: true,
          title: "Lesson Deleted",
          message: "Lesson deleted successfully.",
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
      } catch (err) {
        setConfirmDialog({
          open: true,
          title: "Unable to Delete Lesson",
          message:
            err.response?.data?.message ||
            JSON.stringify(err.response?.data) ||
            err.message ||
            "Failed to delete lesson.",
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

  const uploadLessonFiles = async () => {
    if (!videoFile && !pdfFile) return {};

    const uploadData = new FormData();
    if (videoFile) uploadData.append("video", videoFile);
    if (pdfFile) uploadData.append("pdf", pdfFile);

    const response = await api.post("/upload/lesson-resources", uploadData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total) {
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    });

    return response.data;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedCourse) {
    setConfirmDialog({
      open: true,
      title: "Course Required",
      message: "Please select a course first.",
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
    return;
  }

  try {
    setSavingLesson(true);
    setUploadProgress(videoFile || pdfFile ? 0 : 100);

    const uploadedResources = await uploadLessonFiles();

    const lessonPayload = {
      title: formData.title,
      description: formData.description,
      videoUrl: uploadedResources.videoUrl || formData.videoUrl,
      pdfUrl: uploadedResources.pdfUrl || formData.pdfUrl,
      duration: Number(formData.duration) || 0,
      order: Number(formData.order),
      isPreview: formData.isPreview,
      module: formData.module || null,
    };

    const wasEditing = Boolean(editingLessonId);

    if (wasEditing) {
      await api.put(`/lessons/${editingLessonId}`, lessonPayload);
    } else {
      await api.post("/lessons", {
        ...lessonPayload,
        course: selectedCourse,
      });
    }

    await fetchLessons(selectedCourse);
    resetForm();

    setConfirmDialog({
      open: true,
      title: wasEditing ? "Lesson Updated" : "Lesson Added",
      message: wasEditing
        ? "Lesson updated successfully."
        : "Lesson added successfully.",
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
  } catch (err) {
    console.log(err);
    console.log("Response =>", err.response);

    setConfirmDialog({
      open: true,
      title: "Unable to Save Lesson",
      message:
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message ||
        "Failed to save lesson.",
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
  } finally {
    setSavingLesson(false);
  }
};

  return (
    <div className="admin-lessons-page">
      <h1>Manage Lessons</h1>

      <section className="module-manager">
        <h2>Course Modules</h2>
        <form className="module-form" onSubmit={handleModuleSubmit}>
          <select
            value={selectedCourse}
            onChange={(e) => {
              const courseId = e.target.value;
              setSelectedCourse(courseId);
              setLessons([]);
              setModules([]);
              resetForm();
              resetModuleForm();
              if (courseId) {
                fetchLessons(courseId);
                fetchModules(courseId);
              }
            }}
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>{course.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Module Title"
            value={moduleForm.title}
            onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Module Order"
            value={moduleForm.order}
            onChange={(e) => setModuleForm({ ...moduleForm, order: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Module Description (optional)"
            value={moduleForm.description}
            onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
          />
          <button type="submit">{editingModuleId ? "Update Module" : "Create Module"}</button>
          {editingModuleId && (
            <button type="button" onClick={resetModuleForm}>Cancel Module Edit</button>
          )}
        </form>

        <div className="module-list">
          {modules.map((module) => (
            <div className="module-row" key={module._id}>
              <span>{module.order}. {module.title}</span>
              <div>
                <button type="button" onClick={() => handleEditModule(module)}>Edit</button>
                <button type="button" onClick={() => handleDeleteModule(module._id)}>Delete</button>
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
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <select
          value={selectedCourse}
          onChange={(e) => {
            const courseId = e.target.value;
            setSelectedCourse(courseId);
            if (courseId) {
              fetchLessons(courseId);
              fetchModules(courseId);
            }
          }}
          required
        >
          <option value="">Select Course</option>

          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>

        <select
          name="module"
          value={formData.module}
          onChange={handleChange}
        >
          <option value="">No Module (existing lesson)</option>
          {modules.map((module) => (
            <option key={module._id} value={module._id}>{module.title}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Lesson Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label className="file-upload-field">
          Video File (MP4, MOV, WEBM, AVI, MKV)
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/x-matroska"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
          {videoFile && <small>{videoFile.name}</small>}
        </label>

        <label className="file-upload-field">
          PDF File
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          />
          {pdfFile && <small>{pdfFile.name}</small>}
        </label>

        <input
          type="text"
          placeholder="Video URL"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="PDF URL"
          name="pdfUrl"
          value={formData.pdfUrl}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Duration (Minutes)"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Lesson Order"
          name="order"
          value={formData.order}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="isPreview"
            checked={formData.isPreview}
            onChange={handleChange}
          />
          Free Preview
        </label>

        <button type="submit" disabled={savingLesson}>
          {savingLesson
            ? (videoFile || pdfFile ? `Uploading ${uploadProgress}%...` : "Saving...")
            : editingLessonId ? "Update Lesson" : "Save Lesson"}
        </button>

        {editingLessonId && (
          <button type="button" onClick={resetForm} style={{ marginLeft: "10px" }}>
            Cancel Edit
          </button>
        )}
      </form>

      <hr style={{ margin: "40px 0" }} />

      <h2>Existing Lessons</h2>

      <div className="lesson-list">
        {lessons.length === 0 ? (
          <p>No lessons found.</p>
        ) : (
          lessons.map((lesson) => (
            <div className="lesson-card" key={lesson._id}>
              <div>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" onClick={() => handleEdit(lesson)}>
                  ✏ Edit
                </button>

                <button type="button" onClick={() => handleDelete(lesson._id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminLessons;