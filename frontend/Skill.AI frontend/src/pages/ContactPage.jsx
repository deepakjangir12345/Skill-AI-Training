import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './ContactPage.css'

const ContactPage = () => {
  const [supportConfig, setSupportConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchSupportConfig()
  }, [])

  const fetchSupportConfig = async () => {
    try {
      const response = await api.get('/api/config')
      setSupportConfig(response.data.config.support)
    } catch (error) {
      console.error('Error fetching support config:', error)
      // Fallback configuration
      setSupportConfig({
        email: 'support@skillai.training',
        phone: '+91-97995-50948',
        workingHours: {
          weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
          saturday: 'Saturday: 10:00 AM - 4:00 PM',
          sunday: 'Sunday: Closed'
        },
        responseTime: 'Within 24 hours'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await api.post('/api/support/query', formData)
      
      if (response.data.success) {
        toast.success(response.data.message)
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        toast.error(response.data.message || 'Failed to submit query')
      }
    } catch (error) {
      console.error('Error submitting support query:', error)
      toast.error(error.response?.data?.message || 'Failed to submit query')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="contact-page">
        <Navbar />
        <main className="contact-main">
          <div className="container">
            <div className="spinner"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="contact-page">
      <Navbar />
      <main className="contact-main">
        <div className="container">
          <div className="contact-header">
            <h1 className="page-title">Contact & Support</h1>
            <p className="page-subtitle">
              We're here to help you succeed in your learning journey
            </p>
          </div>

          <div className="contact-content">
            {/* Support Information */}
            <div className="contact-info-section">
              <div className="contact-info-card">
                <div className="contact-info-header">
                  <h2>Get in Touch</h2>
                  <p>Our support team is available to assist you</p>
                </div>
                
                <div className="contact-info-items">
                  <div className="contact-info-item">
                    <div className="contact-icon">📧</div>
                    <div className="contact-details">
                      <h3>Email Support</h3>
                      <p>{supportConfig?.email}</p>
                      <span className="response-time">{supportConfig?.responseTime}</span>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon">📞</div>
                    <div className="contact-details">
                      <h3>Helpline</h3>
                      <p>{supportConfig?.phone}</p>
                      <span className="response-time">Available during working hours</span>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon">🕐</div>
                    <div className="contact-details">
                      <h3>Working Hours</h3>
                      <div className="working-hours">
                        <p>{supportConfig?.workingHours?.weekdays}</p>
                        <p>{supportConfig?.workingHours?.saturday}</p>
                        <p>{supportConfig?.workingHours?.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Form */}
            <div className="contact-form-section">
              <div className="contact-form-card">
                <div className="form-header">
                  <h2>Send us a Message</h2>
                  <p>Fill out the form below and we'll get back to you soon</p>
                </div>

                <form onSubmit={handleSubmit} className="support-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject / Query Type *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="Course Information">Course Information</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Payment Issues">Payment Issues</option>
                      <option value="Account Issues">Account Issues</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Please describe your query in detail..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-large"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage
