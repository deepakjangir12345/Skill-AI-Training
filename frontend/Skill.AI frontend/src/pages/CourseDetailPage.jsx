import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CourseDetailPage.css'

// Course prices mapping (frontend only)
const coursePrices = {
  'English & Personality Development': 599,
  'Basic Computer': 599,
  'AI Technology': 599,
  'Digital Marketing': 599,
  'Full Stack Development': 999
}

// Course details mapping (frontend only for additional info)
const courseDetails = {
  'English & Personality Development': {
    duration: '3 months',
    level: 'Beginner to Intermediate'
  },
  'Basic Computer': {
    duration: '2 months',
    level: 'Beginner'
  },
  'AI Technology': {
    duration: '4 months',
    level: 'Intermediate to Advanced'
  },
  'Digital Marketing': {
    duration: '3 months',
    level: 'Beginner to Intermediate'
  },
  'Full Stack Development': {
    duration: '6 months',
    level: 'Intermediate to Advanced'
  }
}

const CourseDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/courses/${id}`)
      setCourse(response.data.course)
    } catch (error) {
      console.error('Error fetching course:', error)
      setCourse(null)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } })
    } else {
      navigate(`/enroll/${id}`)
    }
  }

  if (loading) {
    return (
      <div className="course-detail-page">
        <Navbar />
        <main className="course-detail-main">
          <div className="container">
            <div className="spinner"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="course-detail-page">
        <Navbar />
        <main className="course-detail-main">
          <div className="container">
            <p>Course not found</p>
            <Link to="/courses" className="btn btn-primary">
              Back to Courses
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const coursePrice = coursePrices[course.name] || 599
  const additionalDetails = courseDetails[course.name] || {}

  return (
    <div className="course-detail-page">
      <Navbar />
      <main className="course-detail-main">
        <div className="container">
          <div className="course-detail-content">
            <div className="course-detail-main-section">
              <h1 className="course-detail-title">{course.name}</h1>
              <p className="course-detail-description">{course.description}</p>
              
              <div className="course-detail-info">
                <div className="info-item">
                  <span className="info-label">Price:</span>
                  <span className="info-value">₹{coursePrice}</span>
                </div>
                {additionalDetails.duration && (
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">{additionalDetails.duration}</span>
                  </div>
                )}
                {additionalDetails.level && (
                  <div className="info-item">
                    <span className="info-label">Level:</span>
                    <span className="info-value">{additionalDetails.level}</span>
                  </div>
                )}
              </div>

              <button className="btn btn-primary btn-large" onClick={handleEnroll}>
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CourseDetailPage


