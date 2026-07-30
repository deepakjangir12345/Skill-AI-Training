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

  useEffect(() => {
    fetchCourseContent()
  }, [courseId])

  const fetchCourseContent = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/courses/${courseId}/content`)
      setCourse(response.data.course)
      setModules(response.data.modules || [])
      if (response.data.modules && response.data.modules.length > 0) {
        setCurrentModule(response.data.modules[0])
      }
    } catch (error) {
      console.error('Error fetching course content:', error)
      // Fallback data
      setModules([
        {
          _id: 'module-1',
          title: 'Introduction',
          content: 'Welcome to the course! This is the introduction module.',
          videoUrl: null,
        },
      ])
      setCurrentModule({
        _id: 'module-1',
        title: 'Introduction',
        content: 'Welcome to the course! This is the introduction module.',
        videoUrl: null,
      })
    } finally {
      setLoading(false)
    }
  }

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
              {currentModule ? (
                <>
                  <h2 className="module-title">{currentModule.title}</h2>
                  {currentModule.videoUrl && (
                    <div className="video-container">
                      <video controls src={currentModule.videoUrl}>
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                  <div className="module-content">
                    <p>{currentModule.content}</p>
                  </div>
                </>
              ) : (
                <div className="no-content">
                  <p>Select a module to start learning</p>
                </div>
              )}
              <div className="learning-actions">
                <Link to="/my-courses" className="btn btn-secondary">
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


