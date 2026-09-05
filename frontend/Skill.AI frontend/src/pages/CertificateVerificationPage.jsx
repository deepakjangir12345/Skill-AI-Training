
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CertificateVerificationPage.css'
import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useRef, useState } from 'react'

const CertificateVerificationPage = () => {
  const [certificateId, setCertificateId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
const [scannerError, setScannerError] = useState('')
const scannerRef = useRef(null)


const startScanner = async () => {
  try {
    setScannerError('')
    setResult(null)
    setScanning(true)

    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    await scanner.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      async (decodedText) => {
  try {
    await scanner.stop()
    scanner.clear()

    scannerRef.current = null
    setScanning(false)

    // QR se certificate ID ya URL dono handle karega
    let scannedValue = decodedText.trim()

    if (scannedValue.includes('/certificates/verify/')) {
      scannedValue = scannedValue.split('/certificates/verify/').pop()
    }

    setCertificateId(scannedValue)

    // Auto verify
    await verifyCertificate(scannedValue)

  } catch (error) {
    console.error(error)

    setResult({
      valid: false,
      message: 'Unable to verify scanned certificate.',
    })

    setScanning(false)
  }
},
      () => {}
    )
  } catch (error) {
    console.error(error)
    setScannerError(
      'Unable to access camera. Please allow camera permission.'
    )
    setScanning(false)
  }
}

const verifyCertificate = async (id) => {
  try {
    setLoading(true)
    setResult(null)

    const response = await api.get(
      `/certificates/verify/${encodeURIComponent(id.trim())}`
    )

    setResult(response.data)
  } catch (error) {
    setResult({
      valid: false,
      message:
        error.response?.data?.message ||
        'Certificate not found',
    })
  } finally {
    setLoading(false)
  }
}

const stopScanner = async () => {
  try {
    if (scannerRef.current) {
      await scannerRef.current.stop()
      scannerRef.current.clear()
      scannerRef.current = null
    }
  } catch (error) {
    console.error(error)
  } finally {
    setScanning(false)
  }
}

  const handleSubmit = async (event) => {
  event.preventDefault()

  if (!certificateId.trim()) return

  await verifyCertificate(certificateId)


    try {
      setLoading(true)
      const response = await api.get(`/certificates/verify/${encodeURIComponent(certificateId.trim())}`)
      setResult(response.data)
    } catch (error) {
      setResult({
        valid: false,
        message: error.response?.data?.message || 'Certificate not found',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="certificate-verification-page">
      <Navbar />
      <main className="certificate-verification-main">
        <section className="certificate-verification-card">
          <h1>Verify Certificate</h1>
          <p>Enter a certificate ID to confirm its authenticity.</p>
          <form onSubmit={handleSubmit}>
            <input
              value={certificateId}
              onChange={(event) => setCertificateId(event.target.value)}
              placeholder="Certificate ID"
              aria-label="Certificate ID"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Verify Certificate'}
            </button>
          </form>

          <button
  type="button"
  className="scan-qr-btn"
  onClick={startScanner}
  disabled={scanning}
>
  {scanning ? 'Scanning...' : '📷 Scan QR Code'}
</button>

{scannerError && (
  <p className="scanner-error">{scannerError}</p>
)}

{scanning && (
  <div className="qr-scanner-container">
    <div id="qr-reader"></div>

    <button
      type="button"
      className="cancel-scan-btn"
      onClick={stopScanner}
    >
      Cancel Scanner
    </button>
  </div>
)}

          {result && (
            <div className={`verification-result ${result.valid ? 'valid' : 'invalid'}`}>
              <h2>{result.valid ? 'Valid Certificate' : 'Certificate Not Found'}</h2>
              {result.valid ? (
                <dl>
                  <div><dt>Certificate ID</dt><dd>{result.certificate.certificateId}</dd></div>
                  <div><dt>Student</dt><dd>{result.certificate.studentName}</dd></div>
                  <div><dt>Course</dt><dd>{result.certificate.courseName}</dd></div>
                  <div><dt>Issue date</dt><dd>{new Date(result.certificate.issueDate).toLocaleDateString()}</dd></div>
                </dl>
              ) : <p>{result.message}</p>}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default CertificateVerificationPage
