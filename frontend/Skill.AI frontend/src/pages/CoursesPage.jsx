import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CoursesPage.css'

// Direct image imports
import englishImg from '../assets/english.jpg'
import computerImg from '../assets/computer.jpg'
import aiImg from '../assets/ai.jpg'
import marketingImg from '../assets/marketing.jpg'
import fullstackImg from '../assets/fullstack.jpg'
import datascienceImg from '../assets/datascience.jpg'
import pythonImg from '../assets/python.jpg'

const CoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/courses')
      setCourses(response.data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      // Fallback to empty array on error
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="courses-page">
        <Navbar />
        <main className="courses-main">
          <div className="container">
            <div className="spinner"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="courses-page">
      <Navbar />
      <main className="courses-main">
        <div className="container">
          <h1 className="page-title">Our Courses</h1>
          {courses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h2>No courses available</h2>
              <p>Please check back later for available courses</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => {
                return (
                  <div key={course._id} className="course-card">
                    {course.name === "English & Personality Development" && (
                      <div className="course-image-wrapper">
                        <img src={englishImg} alt={course.name} className="course-image" />
                      </div>
                    )}
                    {course.name === "Basic Computer" && (
                      <div className="course-image-wrapper">
                        <img src={computerImg} alt={course.name} className="course-image" />
                      </div>
                    )}
                    {course.name === "AI Technology" && (
                      <div className="course-image-wrapper">
                        <img src={aiImg} alt={course.name} className="course-image" />
                      </div>
                    )}
                    {course.name === "Digital Marketing" && (
                      <div className="course-image-wrapper">
                        <img src={marketingImg} alt={course.name} className="course-image" />
                      </div>
                    )}
                    {course.name === "Full Stack Development" && (
                      <div className="course-image-wrapper">
                        <img src={fullstackImg} alt={course.name} className="course-image" />
                      </div>
                    )}
                    {course.name === "Data Science" && (
                      <div className="course-image-wrapper">
                        <img src={datascienceImg} alt={course.name} className="course-image" />
                      </div>
                    )}
                    {course.name.includes("Python") && (
                      <div className="course-image-wrapper">
                        <img src={pythonImg} alt={course.name} className="course-image" />
                      </div>
                    )}
                    <div className="course-card-content">
                      <h3 className="course-name">{course.name}</h3>
                      <p className="course-description">{course.description}</p>
                      <Link
                        to={`/courses/${course._id}`}
                        className="btn btn-primary btn-full"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CoursesPage

