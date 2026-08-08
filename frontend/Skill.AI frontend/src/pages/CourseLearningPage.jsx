import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CourseLearningPage.css'

const CourseLearningPage = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [currentModule, setCurrentModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetchCourseContent()
  }, [courseId])

  const fetchCourseContent = async () => {
  try {
    setLoading(true);

    const response = await api.get(`/courses/${courseId}`);

    setCourse(response.data.course);
    setProgress(response.data.progress || 0);

    const lessonRes = await api.get(`/lessons/${courseId}`);
    console.log("Course ID =", courseId);
console.log("Lesson API Response =", lessonRes.data);

console.log("Lesson Response:", lessonRes.data);

setModules(lessonRes.data.lessons || []);

if (lessonRes.data.lessons?.length > 0) {
  setCurrentModule(lessonRes.data.lessons[0]);
} else {
  setCurrentModule(null);
}

  } catch (error) {
    console.error(error);

    setProgress(0);
    setModules([]);
    setCurrentModule(null);

  } finally {
    setLoading(false);
  }
};

  const handleCompleteLesson = async () => {
  try {
    await api.post("/lessons/complete", {
      lessonId: currentModule._id,
    });

    alert("Lesson Completed ✅");

    fetchCourseContent();

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

  if (loading) {
    return (
      <div className="course-learning-page">
        <Navbar />
        <main className="course-learning-main">
          <div className="container">
            <div className="spinner"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="course-learning-page">
      <Navbar />
      <main className="course-learning-main">
        <div className="container">
          {course && (
  <div className="course-header-card">
    <h1>{course.name}</h1>

    <p>{course.description}</p>

    <div className="course-info">
      <span>💰 ₹{course.price}</span>

      <span>👨‍🏫 Instructor Available</span>
    </div>
  </div>
)} 
          <div className="progress-card">

  <div className="progress-top">

    <span>Course Progress</span>

    <span>{progress}%</span>

  </div>

  <div className="progress-bar">

    <div
      className="progress-fill"
      style={{ width: `${progress}%` }}
    ></div>

  </div>

</div>
          <div className="learning-layout">
            <div className="modules-sidebar">
              <h3>Course Modules</h3>
              <div className="modules-list">
                {modules.map((module, index) => (
                  <button
                    key={module._id}
                    className={`module-item ${
                      currentModule?._id === module._id ? 'active' : ''
                    }`}
                    onClick={() => setCurrentModule(module)}
                  >
                    <span className="module-number">{index + 1}</span>
                    <span className="module-title">{module.title}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="learning-content">
              {currentModule && (
  <>
    <h2>{currentModule.title}</h2>

    <p>{currentModule.description}</p>

    {currentModule.videoUrl && (
      <a
        href={currentModule.videoUrl}
        target="_blank"
        rel="noreferrer"
      >
        ▶ Watch Video
      </a>
    )}

    {currentModule.pdfUrl && (
      <a
        href={currentModule.pdfUrl}
        target="_blank"
        rel="noreferrer"
      >
        📄 Open PDF
      </a>
    )}
  </>
)} 
                <div className="no-content">
                  <p>Select a module to start learning</p>
                </div>
              
              <div className="learning-actions">

  <button
    className="btn btn-primary"
    onClick={handleCompleteLesson}
  >
    ✅ Complete Lesson
  </button>

  <Link
    to="/my-courses"
    className="btn btn-secondary"
  >
    Back to My Courses
  </Link>

</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CourseLearningPage


