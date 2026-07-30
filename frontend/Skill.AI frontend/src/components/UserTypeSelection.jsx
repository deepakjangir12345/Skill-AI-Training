import { useFirstVisit } from '../context/FirstVisitContext'
import './UserTypeSelection.css'

const UserTypeSelection = () => {
  const { showUserTypeSelection, handleUserTypeSelect } = useFirstVisit()

  if (!showUserTypeSelection) return null

  const userTypes = [
    { id: 'student', label: 'Student', icon: '📚' },
    { id: 'college-student', label: 'College Student', icon: '🎓' },
    { id: 'professional', label: 'Professional', icon: '💼' },
  ]

  return (
    <div className="user-type-overlay">
      <div className="user-type-modal">
        <h2 className="user-type-title">Aap kaun ho?</h2>
        <div className="user-type-options">
          {userTypes.map((type) => (
            <button
              key={type.id}
              className="user-type-card"
              onClick={() => handleUserTypeSelect(type.id)}
            >
              <div className="user-type-icon">{type.icon}</div>
              <div className="user-type-label">{type.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserTypeSelection


