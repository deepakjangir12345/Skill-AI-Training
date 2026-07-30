import { useState, useEffect } from 'react'
import api from '../utils/api'

const WhatsAppFloating = () => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWhatsAppConfig()
  }, [])

  const fetchWhatsAppConfig = async () => {
    try {
      const response = await api.get('/api/config')
      setConfig(response.data.config.whatsapp)
    } catch (error) {
      console.error('Error fetching WhatsApp config:', error)
      // Fallback to default config
      setConfig({
        phoneNumber: '919799550948',
        defaultMessage: 'Hello%2C%20mujhe%20courses%20ke%20baare%20me%20information%20chahiye'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = () => {
    if (config) {
      const whatsappUrl = `https://wa.me/${config.phoneNumber}?text=${config.defaultMessage}`
      window.open(whatsappUrl, '_blank')
    }
  }

  if (loading || !config) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        cursor: 'pointer'
      }}
      onClick={handleWhatsAppClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)'
        e.currentTarget.style.transition = 'transform 0.2s ease'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease'
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="white"
          style={{ display: 'block' }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </div>
    </div>
  )
}

export default WhatsAppFloating
