import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './EnrollmentPage.css'

// Course prices mapping (frontend only)
const coursePrices = {
  'English & Personality Development': 599,
  'Basic Computer': 599,
  'AI Technology': 599,
  'Digital Marketing': 599,
  'Full Stack Development': 999
}

const EnrollmentPage = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/courses/${courseId}`)
      setCourse(response.data.course)
    } catch (error) {
      console.error('Error fetching course:', error)
      // Navigate back if course not found
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }

  const handleProceedToPayment = () => {
    navigate(`/payment/${courseId}`)
  }

  if (loading) {
    return (
      <div className="enrollment-page">
        <Navbar />
        <main className="enrollment-main">
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
      <div className="enrollment-page">
        <Navbar />
        <main className="enrollment-main">
          <div className="container">
            <p>Course not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const coursePrice = coursePrices[course.name] || 599

  return (
    <div className="enrollment-page">
      <Navbar />
      <main className="enrollment-main">
        <div className="container">
          <div className="enrollment-card">
            <h1>Enrollment</h1>
            <div className="enrollment-course-info">
              <h2>{course.name}</h2>
              <p className="course-price">₹{coursePrice}</p>
            </div>
            <div className="enrollment-summary">
              <div className="summary-row">
                <span>Course Fee</span>
                <span>₹{coursePrice}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{coursePrice}</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-large btn-full"
              onClick={handleProceedToPayment}
              disabled={enrolling}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default EnrollmentPage


