import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './MyCertificatesPage.css'

const MyCertificatesPage = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
  const fetchCertificates = async () => {
    try {
      setLoading(true)

      const response = await api.get('/certificates/my')

      setCertificates(response.data)
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to load certificates.'
      )
    } finally {
      setLoading(false)
    }
  }

  fetchCertificates()
}, [])

const handleDownload = async (certificateId) => {
  try {
    const response = await api.get(
      `/certificates/download/${certificateId}`,
      {
        responseType: 'blob',
      }
    )

    const url = URL.createObjectURL(response.data)

    const link = document.createElement('a')

    link.href = url
    link.download = `${certificateId}.pdf`

    document.body.appendChild(link)

    link.click()

    link.remove()

    URL.revokeObjectURL(url)

  } catch (error) {
    setError(
      error.response?.data?.message ||
      'Unable to download certificate.'
    )
  }
}

const filteredCertificates = certificates.filter((certificate) => {
  const courseName = certificate.course?.name || ''
  const certificateId = certificate.certificateId || ''

  return (
    courseName.toLowerCase().includes(search.toLowerCase()) ||
    certificateId.toLowerCase().includes(search.toLowerCase())
  )
})

  return (
    <div>
      <Navbar />

      <main className="my-certificates-main">
        <div className="container">
          <div className="my-certificates-header">
  <div>
    <span className="certificate-page-badge">🏆 Achievement Center</span>
    <h1>My Certificates</h1>
    <p>View and access all the certificates you have earned.</p>
  </div>
  <div className="certificate-search">
  <input
    type="text"
    placeholder="Search by course name or certificate ID..."
    value={search}
    onChange={(event) => setSearch(event.target.value)}
  />
</div>
</div>

          {loading && <p>Loading certificates...</p>}

          {error && <p>{error}</p>}
          {!loading && certificates.length === 0 && (
  <div>
    <h3>No Certificates Yet</h3>
    <p>Complete your enrolled courses to earn certificates.</p>

    <Link to="/my-courses">
      Go to My Courses
    </Link>
  </div>
)}

{!loading && filteredCertificates.length > 0 && (
  <div className="certificates-grid">

    {filteredCertificates.map((certificate) => (

      <div
        className="certificate-card"
        key={certificate._id}
      >

        <div className="certificate-card-top">
          <div className="certificate-icon">
            🏆
          </div>

          <span className="certificate-status">
            Earned
          </span>
        </div>

        <h2>
          {certificate.course?.name || 'Course'}
        </h2>

        <div className="certificate-details">

          <div className="certificate-detail">
            <span>Certificate ID</span>
            <strong>{certificate.certificateId}</strong>
          </div>

          <div className="certificate-detail">
            <span>Issued On</span>
            <strong>
              {new Date(certificate.issuedAt).toLocaleDateString()}
            </strong>
          </div>

        </div>

        <div className="certificate-actions">

  <Link
    to={`/certificate/${certificate.course?._id}`}
    className="view-certificate-btn"
  >
    👁 View Certificate
  </Link>

  <button
    type="button"
    className="download-certificate-btn"
    onClick={() => handleDownload(certificate.certificateId)}
  >
    📥 Download PDF
  </button>

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

export default MyCertificatesPage