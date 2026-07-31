import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { getCourseById } from '../data/courses'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CertificatePage.css'

const CertificatePage = () => {
  const { courseId } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    fetchCertificateData()
  }, [courseId])

  const fetchCertificateData = async () => {
    try {
      setLoading(true)
      // Check if certificate exists (course completed)
      const response = await api.get(`/certificates/${courseId}`)
      
      if (response.data.success) {
        // Certificate exists - course is completed
        setIsCompleted(true)
        setCertificate(response.data.certificate)
        
        // Get course details from frontend data
        const courseDetails = getCourseById(courseId)
        setCourse(courseDetails || response.data.course)
      } else {
        // No certificate - course not completed
        setIsCompleted(false)
        // Still get course details for display
        const courseDetails = getCourseById(courseId)
        setCourse(courseDetails || response.data.course)
      }
    } catch (error) {
      console.error('Error fetching certificate:', error)
      // Assume course not completed if there's an error
      setIsCompleted(false)
      
      // Still try to get course info
      try {
        const courseDetails = getCourseById(courseId)
        setCourse(courseDetails)
      } catch (err) {
        console.error('Error getting course details:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    // This would trigger a PDF download from backend
    window.open(`http://localhost:5000/api/certificates/${courseId}/download`, '_blank')
  }

  const handleShareOnLinkedIn = () => {
    const courseName = course?.name || 'Course'
    const certificateText = `I have successfully completed the ${courseName} course from Skill.AI Training! 🎓`
    const certificateUrl = window.location.href
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}&summary=${encodeURIComponent(certificateText)}`
    window.open(linkedInUrl, '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="certificate-page">
        <Navbar />
        <main className="certificate-main">
          <div className="container">
            <div className="spinner"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="certificate-page">
      <Navbar />
      <main className="certificate-main">
        <div className="container">
          <div className="certificate-container">
            {!isCompleted ? (
              // Locked State - Course not completed
              <div className="certificate-locked">
                <div className="locked-icon">🔒</div>
                <h1>Certificate Locked</h1>
                <p className="locked-message">
                  This certificate is issued only after successful course completion.
                </p>
                <div className="course-info">
                  <h3>{course?.name || 'Course Name'}</h3>
                  <p>Complete all course modules to unlock your certificate</p>
                </div>
                <div className="locked-actions">
                  <Link to={`/learn/${courseId}`} className="btn btn-primary">
                    Continue Learning
                  </Link>
                  <Link to="/my-courses" className="btn btn-outline">
                    Back to My Courses
                  </Link>
                </div>
              </div>
            ) : (
              // Unlocked State - Course completed
              <>
                <div className="certificate">
                  <div className="certificate-header">
                    <h1>Certificate of Completion</h1>
                    <p className="certificate-subtitle">This is to certify that</p>
                  </div>
                  <div className="certificate-body">
                    <h2 className="certificate-name">{user?.name || 'Student Name'}</h2>
                    <p className="certificate-text">
                      has successfully completed the course
                    </p>
                    <h3 className="certificate-course-name">
                      {course?.name || 'Course Name'}
                    </h3>
                    {certificate?.completionDate && (
                      <p className="certificate-date">
                        Completed on: {new Date(certificate.completionDate).toLocaleDateString()}
                      </p>
                    )}
                    {certificate?.certificateId && (
                      <p className="certificate-id">
                        Certificate ID: {certificate.certificateId}
                      </p>
                    )}
                  </div>
                  <div className="certificate-footer">
                    <div className="certificate-signature">
                      <div className="signature-line"></div>
                      <p>Authorized Signature</p>
                    </div>
                    <div className="certificate-logo">
                      <h4>Skill.AI Training</h4>
                    </div>
                  </div>
                </div>
                <div className="certificate-actions">
                  <button className="btn btn-primary" onClick={handleDownload}>
                    📥 Download Certificate
                  </button>
                  <button className="btn btn-secondary" onClick={handleShareOnLinkedIn}>
                    💼 Share on LinkedIn
                  </button>
                  <Link to="/my-courses" className="btn btn-outline">
                    Back to My Courses
                  </Link>
                </div>
                <div className="certificate-note">
                  <p>
                    <strong>Note:</strong> This certificate is issued only after successful course completion. 
                    It validates your successful completion of the course and can be shared with employers.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CertificatePage


