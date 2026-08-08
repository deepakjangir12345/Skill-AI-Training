import { useState, useEffect } from "react";
import api from "../utils/api";
import "./AdminLessons.css";

const AdminLessons = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    pdfUrl: "",
    duration: "",
    order: "",
    isPreview: false,
  });

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

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/lessons", {
  title: formData.title,
  description: formData.description,
  videoUrl: formData.videoUrl,
  pdfUrl: formData.pdfUrl,
  duration: Number(formData.duration) || 0,
  order: Number(formData.order),
  isPreview: formData.isPreview,
  course: selectedCourse,
});
      fetchLessons(selectedCourse);

      alert("Lesson Added Successfully ✅");

      setFormData({
        title: "",
        description: "",
        videoUrl: "",
        pdfUrl: "",
        duration: "",
        order: "",
        isPreview: false,
      });

    } catch (err) {
  console.log(err);

  console.log("Response =>", err.response);

  alert(
    err.response?.data?.message ||
    JSON.stringify(err.response?.data) ||
    err.message
  );
}
  };

  return (
    <div className="container">

      <h1>Manage Lessons</h1>

      <form onSubmit={handleSubmit}>

        <select
          value={selectedCourse}
          onChange={(e) => {
    setSelectedCourse(e.target.value);
    fetchLessons(e.target.value);
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

        <button type="submit">
          Save Lesson
        </button>

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

          <button type="button">
            ✏ Edit
          </button>

          <button type="button">
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