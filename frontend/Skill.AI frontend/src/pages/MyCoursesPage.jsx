import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './MyCoursesPage.css'

// Course images - external URLs (mapped by course name)
const courseImages = {
  'English & Personality Development': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop',
  'Basic Computer': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
  'AI Technology': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop',
  'Digital Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
  'Full Stack Development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
}

// Course details mapping (frontend only for additional info)
const courseDetails = {
  'English & Personality Development': {
    duration: '3 months',
    level: 'Beginner to Intermediate',
    category: 'Soft Skills'
  },
  'Basic Computer': {
    duration: '2 months',
    level: 'Beginner',
    category: 'Computer Skills'
  },
  'AI Technology': {
    duration: '4 months',
    level: 'Intermediate to Advanced',
    category: 'Technology'
  },
  'Digital Marketing': {
    duration: '3 months',
    level: 'Beginner to Intermediate',
    category: 'Marketing'
  },
  'Full Stack Development': {
    duration: '6 months',
    level: 'Intermediate to Advanced',
    category: 'Programming'
  }
}

const MyCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchMyCourses()
  }, [])

  const fetchMyCourses = async () => {
    try {
      setLoading(true)
      // Fetch enrollment data from backend
      const response = await api.get('/enrollments/my')
      const enrollments = response.data.enrollments || []
      console.log(enrollments);
      
      // Map enrollment data with course details
      const coursesWithDetails = enrollments.map(enrollment => {
        const details = courseDetails[enrollment.course?.name] || {};

return {
  ...enrollment,
  courseDetails: {
    name: enrollment.course?.name || "Untitled Course",
    description:
      enrollment.course?.description || "Course description available",
    image:
      enrollment.course?.thumbnail ||
      courseImages[enrollment.course?.name] ||
      courseImages["English & Personality Development"],
    ...details,
  },
};
      })
      
      setEnrolledCourses(coursesWithDetails)
    } catch (error) {
      console.error('Error fetching my courses:', error)
      // Show error state
      setEnrolledCourses([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="my-courses-page">
        <Navbar />
        <main className="my-courses-main">
          <div className="container">
            <div className="spinner"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="my-courses-page">
      <Navbar />
      <main className="my-courses-main">
        <div className="container">
          <h1 className="page-title">My Courses</h1>
          {enrolledCourses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h2>No courses enrolled yet</h2>
              <p>Start learning by enrolling in a course</p>
              <Link to="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="courses-grid">
              {enrolledCourses.map((enrollment) => (
                <div key={enrollment._id} className="course-card-enrolled">
                  <div className="course-image-container">
                    <img 
                      src={enrollment.courseDetails.image} 
                      alt={enrollment.courseDetails.name}
                      className="course-image"
                    />
                    <div className="course-overlay">
                      <span className="course-category">{enrollment.courseDetails.category}</span>
                    </div>
                  </div>
                  <div className="course-card-content">
                    <h3 className="course-name">{enrollment.courseDetails.name}</h3>
                    <p className="course-description">
                      {enrollment.courseDetails.description}
                    </p>
                    <div className="course-meta">
                      <span className="course-duration">⏱️ {enrollment.courseDetails.duration}</span>
                      <span className="course-level">📊 {enrollment.courseDetails.level}</span>
                    </div>
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {enrollment.progress || 0}% Complete
                      </span>
                    </div>
                    <div className="course-actions">
                      <Link
                        to={`/learn/${enrollment.course?._id || enrollment.courseId}`}
                        className="btn btn-primary btn-small"
                      >
                        Continue Learning
                      </Link>
                      {enrollment.completed && (
                        <Link
                          to={`/certificate/${enrollment.courseId}`}
                          className="btn btn-outline btn-small"
                        >
                          View Certificate
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MyCoursesPage


