import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CertificatePage.css'

const CertificatePage = () => {
  const { courseId } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [certificate, setCertificate] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isEligible, setIsEligible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get(`/certificates/${courseId}`)
        setCourse(response.data.course || null)
        setCertificate(response.data.certificate || null)
        setProgress(response.data.progress || 0)
        setIsEligible(Boolean(response.data.eligible))
        const settingsResponse = await api.get('/admin/certificate-settings')

setSettings(settingsResponse.data.settings || null)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to check certificate status.')
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [courseId])

  const handleGenerate = async () => {
    try {
      setGenerating(true)
      setError('')
      const response = await api.post(`/certificates/${courseId}/generate`)
      setCertificate(response.data.certificate)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to generate certificate.')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await api.get(`/certificates/download/${certificate.certificateId}`, { responseType: 'blob' })
      const url = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `${certificate.certificateId}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to download certificate.')
    }
  }

  if (loading) {
    return <><Navbar /><main className="certificate-main"><div className="container"><div className="spinner" /></div></main><Footer /></>
  }

  return (
    <div className="certificate-page">
      <Navbar />
      <main className="certificate-main">
        <div className="container">
          <div className="certificate-container">
            {error && <div className="certificate-note"><p>{error}</p></div>}
            {!isEligible ? (
              <div className="certificate-locked">
                <div className="locked-icon">🔒</div>
                <h1>Certificate Locked</h1>
                <p className="locked-message">Complete all lessons to unlock your certificate.</p>
                <div className="course-info"><h3>{course?.name || 'Course'}</h3><p>Current progress: {progress}%</p></div>
                <div className="locked-actions"><Link to={`/learn/${courseId}`} className="btn btn-primary">Continue Learning</Link><Link to="/my-courses" className="btn btn-outline">Back to My Courses</Link></div>
              </div>
            ) : !certificate ? (
              <div className="certificate-locked">
                <div className="locked-icon">🏆</div>
                <h1>Certificate Ready</h1>
                <p className="locked-message">You completed every lesson in this course.</p>
                <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>{generating ? 'Generating...' : 'Generate Certificate'}</button>
              </div>
            ) : (
              <>
                <div className="certificate">
                  <div className="certificate-header">
  <h1>
    {settings?.certificateTitle || 'Certificate of Completion'}
  </h1>

  <p className="certificate-subtitle">
    {settings?.subtitle || 'This is to certify that'}
  </p>
</div>
                  <div className="certificate-body"><h2 className="certificate-name">{user?.name || 'Student'}</h2><p className="certificate-text">has successfully completed the course</p><h3 className="certificate-course-name">{course?.name || 'Course'}</h3><p className="certificate-date">Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}</p><p className="certificate-id">Certificate ID: {certificate.certificateId}</p></div>
                  <div className="certificate-footer"><div className="certificate-signature">

  {settings?.signatureImageUrl ? (
    <img
      src={settings.signatureImageUrl}
      alt="Authorized Signature"
      className="certificate-signature-image"
    />
  ) : (
    <div className="signature-line" />
  )}

  <p>
    {settings?.signatureName || 'Authorized Signature'}
  </p>

  {settings?.signatureDesignation && (
    <small>
      {settings.signatureDesignation}
    </small>
  )}

</div><div className="certificate-logo">
  {settings?.logoUrl && (
    <img
      src={settings.logoUrl}
      alt="Organization Logo"
      className="certificate-logo-image"
    />
  )}

  <h4>
    {settings?.organizationName || 'Skill.AI Training'}
  </h4>
</div></div>
                </div>
                <div className="certificate-actions"><button className="btn btn-primary" onClick={handleDownload}>📥 Download Certificate</button><Link to="/my-courses" className="btn btn-outline">Back to My Courses</Link></div>
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