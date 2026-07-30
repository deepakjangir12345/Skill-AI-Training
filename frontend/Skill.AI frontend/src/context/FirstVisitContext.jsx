import { createContext, useContext, useState, useEffect } from 'react'

const FirstVisitContext = createContext()

export const useFirstVisit = () => {
  const context = useContext(FirstVisitContext)
  if (!context) {
    throw new Error('useFirstVisit must be used within a FirstVisitProvider')
  }
  return context
}

export const FirstVisitProvider = ({ children }) => {
  const [showOfferAlert, setShowOfferAlert] = useState(false)
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false)
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    // Check if offer alert has been shown
    const offerAlertShown = localStorage.getItem('offerAlertShown')
    if (!offerAlertShown) {
      setShowOfferAlert(true)
    }

    // Check if user type has been selected
    const savedUserType = localStorage.getItem('userType')
    if (savedUserType) {
      setUserType(savedUserType)
    } else if (offerAlertShown) {
      // If offer alert was already shown, show user type selection
      setShowUserTypeSelection(true)
    }
  }, [])

  const handleOfferAlertClose = () => {
    localStorage.setItem('offerAlertShown', 'true')
    setShowOfferAlert(false)
    
    // Show user type selection after offer alert
    const savedUserType = localStorage.getItem('userType')
    if (!savedUserType) {
      setTimeout(() => {
        setShowUserTypeSelection(true)
      }, 300)
    }
  }

  const handleUserTypeSelect = (type) => {
    localStorage.setItem('userType', type)
    setUserType(type)
    setShowUserTypeSelection(false)
  }

  const value = {
    showOfferAlert,
    showUserTypeSelection,
    userType,
    handleOfferAlertClose,
    handleUserTypeSelect,
    setShowOfferAlert,
    setShowUserTypeSelection,
  }

  return (
    <FirstVisitContext.Provider value={value}>
      {children}
    </FirstVisitContext.Provider>
  )
}

