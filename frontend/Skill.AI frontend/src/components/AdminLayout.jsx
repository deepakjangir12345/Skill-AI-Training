import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './AdminLayout.css'

const AdminLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/courses', label: 'Courses', icon: '📚' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/enrollments', label: 'Enrollments', icon: '📝' },
    { path: '/admin/payments', label: 'Payments', icon: '💳' },
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
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Skill.AI Admin</h2>
        </div>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <h1>Admin Panel</h1>
          </div>
          <div className="admin-header-right">
            <span className="admin-user-name">
              {user?.name || 'Admin'}
            </span>
            <button onClick={handleLogout} className="admin-logout-btn">
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
