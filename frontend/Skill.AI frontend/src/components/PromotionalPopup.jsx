import { useState, useEffect } from 'react'

const PromotionalPopup = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if popup has been shown in this session
    const popupShown = sessionStorage.getItem('promotionalPopupShown')
    
    if (!popupShown) {
      // Show popup immediately on page load
      setIsVisible(true)
      sessionStorage.setItem('promotionalPopupShown', 'true')
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleEnrollNow = () => {
    setIsVisible(false)
    // Redirect to courses page
    window.location.href = '/courses'
  }

  if (!isVisible) {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'slideUp 0.4s ease-out',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6'
            e.target.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.color = '#6b7280'
          }}
        >
          ✕
        </button>

        {/* Content */}
        <div style={{ padding: '40px 32px 32px' }}>
          {/* Fire Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#fef3c7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px'
          }}>
            🔥
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            textAlign: 'center',
            margin: '0 0 16px',
            lineHeight: '1.2'
          }}>
            Limited Seats Available!
          </h2>

          {/* Subtext */}
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            textAlign: 'center',
            margin: '0 0 32px',
            lineHeight: '1.5'
          }}>
            Enroll now in our job-oriented courses. Limited seats only – offer valid for a short time.
          </p>

          {/* Highlight Points */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '20px', marginRight: '12px' }}>✓</span>
              <span style={{ fontSize: '15px', color: '#374151' }}>Industry-ready training</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '20px', marginRight: '12px' }}>✓</span>
              <span style={{ fontSize: '15px', color: '#374151' }}>Practical learning</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0',
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '20px', marginRight: '12px' }}>✓</span>
              <span style={{ fontSize: '15px', color: '#374151' }}>Career support</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleEnrollNow}
            style={{
              width: '100%',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '12px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626'
              e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ef4444'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            Enroll Now →
          </button>

          {/* Secondary Action */}
          <button
            onClick={handleClose}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb'
              e.target.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.borderColor = '#e5e7eb'
            }}
          >
            Maybe Later
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}

export default PromotionalPopup
