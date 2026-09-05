import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './AuthPage.css'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setRegisterError('')

  if (formData.password !== formData.confirmPassword) {
    setRegisterError('Passwords do not match')
    return
  }

  setLoading(true)

  try {
    const { confirmPassword, ...userData } = formData
    const result = await register(userData)

    if (result?.success) {
      navigate('/courses')
    } else {
      setRegisterError(
        result?.error || 'Registration failed'
      )
    }
  } catch (error) {
    console.error('Registration error:', error)

    setRegisterError(
      error.response?.data?.message ||
      'Registration failed'
    )
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="auth-page auth-register-page">
      <Navbar />
      <main className="auth-main">
        <div className="auth-container">

  <div className="auth-visual-panel">
    <div className="auth-brand-mark">S</div>

    <div className="auth-3d-content">
      <span className="auth-visual-badge">SKILL.AI TRAINING</span>

      <h2>Join Skill.AI</h2>

      <p>
        Start learning today and build skills for your future.
      </p>

      <div className="login-3d-scene">
        <div className="login-3d-shadow"></div>

        <div className="login-3d-board">
          <div className="login-3d-board-front">
            <span className="login-lock">🚀</span>
            <span className="login-3d-text">JOIN</span>
          </div>

          <div className="login-3d-board-side"></div>
        </div>

        <div className="login-3d-key">
          <span className="key-ring"></span>
          <span className="key-shaft"></span>
          <span className="key-tooth key-tooth-one"></span>
          <span className="key-tooth key-tooth-two"></span>
        </div>
      </div>
    </div>

    <div className="auth-orbit auth-orbit-one"></div>
    <div className="auth-orbit auth-orbit-two"></div>
  </div>

  <div className="auth-card">
            <h1>Register</h1>
            <p className="auth-subtitle">Join Skill.AI Training today</p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
              {registerError && (
  <div className="login-error-message">
    ⚠️ {registerError}
  </div>
)}
            </form>
            <p className="auth-footer">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RegisterPage


