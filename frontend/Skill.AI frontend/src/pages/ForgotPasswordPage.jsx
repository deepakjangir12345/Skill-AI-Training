import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './AuthPage.css'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/forgot-password', { email })
      
      if (response.data.message) {
        setSubmitted(true)
        toast.success('Password reset link sent to your email')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="auth-page">
        <Navbar />
        <main className="auth-main">
          <div className="auth-container">
            <div className="auth-card">
              <div className="success-message">
                <h2>Check Your Email</h2>
                <p>We've sent a password reset link to:</p>
                <p className="email-highlight">{email}</p>
                <p>The link will expire in 10 minutes.</p>
                <p>Didn't receive the email? Check your spam folder.</p>
              </div>
              <div className="auth-actions">
                <button
                  className="btn btn-secondary btn-full"
                  onClick={() => {
                    setSubmitted(false)
                    setEmail('')
                  }}
                >
                  Try Again
                </button>
                <Link to="/login" className="btn btn-primary btn-full">
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-main">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Forgot Password</h1>
            <p className="auth-subtitle">
              Enter your email address and we'll send you a link to reset your password
            </p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            
            <p className="auth-footer">
              <Link to="/login" className="back-to-login">
                ← Back to Login
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ForgotPasswordPage
