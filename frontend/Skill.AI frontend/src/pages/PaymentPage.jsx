import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PaymentPage.css'

const PaymentPage = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/courses/${courseId}`)
      setCourse(response.data.course)
    } catch (error) {
      console.error('Error fetching course details:', error)
      toast.error('Failed to load course details')
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => {
        console.error('Failed to load Razorpay script')
        resolve()
      }
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!course) {
      toast.error('Course not found')
      return
    }

    if (paymentMethod === 'upi') {
      // Handle UPI payment
      handleUPIPayment()
      return
    }

    // Handle Razorpay payment
    try {
      setProcessing(true)

      await loadRazorpayScript()

      // Use course price from backend
      const coursePrice = course.price || 599

      // Create order on backend
      const orderResponse = await api.post('/api/payment/create-order', {
        courseId,
        amount: coursePrice,
      })

      const { orderId, amount, currency, key } = orderResponse.data

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        toast.error('Payment service is loading. Please try again.')
        setProcessing(false)
        return
      }

      // Initialize Razorpay
      const options = {
        key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency || 'INR',
        name: 'Skill.AI Training',
        description: `Payment for ${course.name}`,
        order_id: orderId,
        handler: async (response) => {
          // Verify payment on backend
          try {
            const verifyResponse = await api.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
            })

            if (verifyResponse.data.success) {
              toast.success('Payment successful! You have been enrolled.')
              navigate('/my-courses')
            } else {
              toast.error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error(error.response?.data?.message || 'Payment verification failed')
          } finally {
            setProcessing(false)
          }
        },
        prefill: {
          name: user?.name || 'User',
          email: user?.email || 'user@example.com',
        },
        theme: {
          color: '#667eea',
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
          },
          escape: false,
          handleback: false,
        },
      }

      if (!options.key) {
        toast.error('Payment is not configured. Please try again later.')
        setProcessing(false)
        return
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.response?.data?.message || 'Failed to initiate payment')
      setProcessing(false)
    }
  }

  const handleUPIPayment = () => {
    // Show UPI payment details with QR code
    const modal = document.createElement('div')
    modal.className = 'upi-modal'
    modal.innerHTML = `
      <div class="upi-modal-content">
        <div class="upi-modal-header">
          <h3>UPI Payment</h3>
          <button class="close-modal" onclick="this.closest('.upi-modal').remove()">×</button>
        </div>
        <div class="upi-modal-body">
          <div class="upi-qr-section">
            <img src="/src/assets/upi-qr-code.png" alt="UPI QR Code" class="upi-qr-code" />
            <p>Scan QR code with any UPI app</p>
          </div>
          <div class="upi-details-section">
            <div class="upi-info">
              <h4>UPI Details:</h4>
              <div class="upi-id-container">
                <strong>UPI ID:</strong> 
                <span id="upi-id">9079603363-2@axl</span>
                <button class="copy-btn" onclick="copyUPIId()">Copy</button>
              </div>
              <div class="upi-amount">
                <strong>Amount:</strong> ₹${course.price}
              </div>
            </div>
            <div class="upi-steps">
              <h4>Payment Steps:</h4>
              <ol>
                <li>Scan the QR code OR copy the UPI ID</li>
                <li>Open your UPI app (GPay, PhonePe, Paytm, etc.)</li>
                <li>Send ₹${course.price} to this UPI ID</li>
                <li>Take a screenshot of the payment confirmation</li>
                <li>We will verify and enroll you manually within 24 hours</li>
              </ol>
            </div>
          </div>
        </div>
        <div class="upi-modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.upi-modal').remove()">Close</button>
          <button class="btn btn-primary" onclick="confirmUPIPayment()">I Have Paid</button>
        </div>
      </div>
    `
    
    // Add modal styles
    const style = document.createElement('style')
    style.textContent = `
      .upi-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      }
      .upi-modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
      }
      .upi-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
      }
      .upi-qr-section {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .upi-qr-code {
        width: 200px;
        height: 200px;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-bottom: 0.5rem;
      }
      .upi-id-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0.5rem 0;
      }
      .copy-btn {
        background: #667eea;
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
      }
      .upi-steps ol {
        margin: 1rem 0;
        padding-left: 1.5rem;
      }
      .upi-steps li {
        margin: 0.5rem 0;
      }
      .upi-modal-footer {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(modal)
    
    // Add global functions for modal
    window.copyUPIId = () => {
      const upiId = document.getElementById('upi-id').textContent
      navigator.clipboard.writeText(upiId).then(() => {
        toast.success('UPI ID copied to clipboard!')
      })
    }
    
    window.confirmUPIPayment = () => {
      modal.remove()
      toast.success('Thank you! We will verify your payment and enroll you within 24 hours.')
      // Here you could also send a notification to admin
      navigate('/my-courses')
    }
  }

  if (loading) {
    return (
      <div className="payment-page">
        <Navbar />
        <main className="payment-main">
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
      <div className="payment-page">
        <Navbar />
        <main className="payment-main">
          <div className="container">
            <p>Course not found</p>
            <button className="btn btn-primary" onClick={() => navigate('/courses')}>
              Back to Courses
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="payment-page">
      <Navbar />
      <main className="payment-main">
        <div className="container">
          <div className="payment-card">
            <div className="payment-header">
              <h1>Complete Your Purchase</h1>
              <div className="secure-badge">
                <span className="lock-icon">🔒</span>
                <span>Secure Payment</span>
              </div>
            </div>
            
            <div className="payment-course-info">
              <h2>{course.name}</h2>
              <div className="course-meta">
                <span className="course-category">Course</span>
                <span className="course-price">₹{course.price}</span>
              </div>
            </div>

            <div className="payment-user-info">
              <h3>Billing Information</h3>
              <div className="user-details">
                <div className="user-detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{user?.email || 'user@example.com'}</span>
                </div>
                <div className="user-detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{user?.name || 'User'}</span>
                </div>
              </div>
            </div>

            <div className="payment-methods">
              <h3>Select Payment Method</h3>
              <div className="payment-methods-grid">
                <div 
                  className={`payment-method ${paymentMethod === 'razorpay' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <span className="method-icon">💳</span>
                  <span>Credit/Debit Cards</span>
                  <span className="method-subtitle">Visa, Mastercard, Rupay</span>
                </div>
                <div 
                  className={`payment-method ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <span className="method-icon">📱</span>
                  <span>UPI Payment</span>
                  <span className="method-subtitle">9079603363-2@axl</span>
                </div>
                <div 
                  className={`payment-method ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <span className="method-icon">🏦</span>
                  <span>Net Banking</span>
                  <span className="method-subtitle">All major banks</span>
                </div>
              </div>
              
              {paymentMethod === 'upi' && (
                <div className="upi-details">
                  <h4>UPI Payment Details</h4>
                  <div className="upi-info">
                    <div className="upi-id">
                      <strong>UPI ID:</strong> 9079603363-2@axl
                    </div>
                    <div className="upi-steps">
                      <p>1. Copy the UPI ID above</p>
                      <p>2. Open your UPI app (GPay, PhonePe, Paytm, etc.)</p>
                      <p>3. Send ₹{course.price} to this UPI ID</p>
                      <p>4. We will verify and enroll you manually</p>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="payment-note">
                All transactions are secure and encrypted. Powered by Razorpay.
              </p>
            </div>

            <div className="payment-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Course Fee</span>
                <span>₹{course.price}</span>
              </div>
              <div className="summary-row">
                <span>Platform Fee</span>
                <span>₹0</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{course.price}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-large btn-full payment-button"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="spinner-small"></span>
                  Processing Payment...
                </>
              ) : (
                <>
                  {paymentMethod === 'upi' ? (
                    <>Show UPI Details</>
                  ) : (
                    <>Pay Now ₹{course.price}</>
                  )}
                </>
              )}
            </button>

            <div className="payment-footer">
              <p>By completing this purchase, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PaymentPage


