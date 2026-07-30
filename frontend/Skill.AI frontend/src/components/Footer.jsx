import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">Skill.AI Training</h3>
            <p>Empowering learners with cutting-edge skills and knowledge.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <Link to="/contact">Contact & Support</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Skill.AI Training. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


