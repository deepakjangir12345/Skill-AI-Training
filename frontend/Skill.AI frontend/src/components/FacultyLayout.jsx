import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './FacultyLayout.css'

const FacultyLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { path: '/faculty/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/faculty/courses', label: 'My Courses', icon: '📚' },
    { path: '/faculty/upload', label: 'Upload Videos', icon: '📹' },
    { path: '/faculty/manage', label: 'Manage Lectures', icon: '⚙️' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const getUser = () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  const user = getUser()

  return (
    <div className="faculty-layout">
      <div className="faculty-sidebar">
        <div className="faculty-logo">
          <h2>Faculty Panel</h2>
        </div>
        <nav className="faculty-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`faculty-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="faculty-nav-icon">{item.icon}</span>
              <span className="faculty-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="faculty-main">
        <header className="faculty-header">
          <div className="faculty-header-left">
            <h1>Faculty Dashboard</h1>
          </div>
          <div className="faculty-header-right">
            <span className="faculty-user-name">
              {user?.name || 'Faculty'}
            </span>
            <button onClick={handleLogout} className="faculty-logout-btn">
              Logout
            </button>
          </div>
        </header>

        <main className="faculty-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default FacultyLayout
