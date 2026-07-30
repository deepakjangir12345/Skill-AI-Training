import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Skill.AI Training
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/courses" className="navbar-link">Courses</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to="/my-courses" className="navbar-link">My Courses</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-primary btn-small">Admin Panel</Link>
              )}
              <div className="navbar-user">
                <span className="navbar-user-name">{user?.name}</span>
                <button className="btn btn-outline btn-small" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-small">
                Register
              </Link>
            </>
          )}
        </div>
        <button className="navbar-toggle" aria-label="Toggle menu">
          ☰
        </button>
      </div>
    </nav>
  )
}

export default Navbar


