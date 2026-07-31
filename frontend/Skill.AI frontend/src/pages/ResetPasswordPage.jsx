import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './AuthPage.css'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setTokenValid(false)
    }
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: formData.newPassword
      })
      
      if (response.data.message) {
        setSuccess(true)
        toast.success('Password reset successfully')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="auth-page">
        <Navbar />
        <main className="auth-main">
          <div className="auth-container">
            <div className="auth-card">
              <div className="error-message">
                <h2>Invalid Reset Link</h2>
                <p>The password reset link is invalid or has expired.</p>
                <p>Please request a new password reset.</p>
              </div>
              <div className="auth-actions">
                <Link to="/forgot-password" className="btn btn-primary btn-full">
                  Request New Reset Link
                </Link>
                <Link to="/login" className="btn btn-secondary btn-full">
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

  if (success) {
    return (
      <div className="auth-page">
        <Navbar />
        <main className="auth-main">
          <div className="auth-container">
            <div className="auth-card">
              <div className="success-message">
                <h2>Password Reset Successful</h2>
                <p>Your password has been updated successfully.</p>
                <p>You can now log in with your new password.</p>
              </div>
              <div className="auth-actions">
                <Link to="/login" className="btn btn-primary btn-full">
                  Go to Login
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
            <h1>Reset Password</h1>
            <p className="auth-subtitle">
              Enter your new password below
            </p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password"
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm new password"
                  minLength="6"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordPage
