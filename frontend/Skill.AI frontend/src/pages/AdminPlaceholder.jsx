import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import './AdminPlaceholder.css'

const AdminPlaceholder = () => {
  const { isAuthenticated, user } = useAuth()

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirect non-admin users to home
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="admin-placeholder">
      <div className="admin-placeholder-container">
        <div className="admin-placeholder-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-badge">Coming Soon</div>
        </div>
        
        <div className="admin-placeholder-content">
          <div className="placeholder-card">
            <div className="placeholder-icon">📊</div>
            <h3>Analytics & Reports</h3>
            <p>View platform statistics and user analytics</p>
          </div>
          
          <div className="placeholder-card">
            <div className="placeholder-icon">👥</div>
            <h3>User Management</h3>
            <p>Manage users, roles, and permissions</p>
          </div>
          
          <div className="placeholder-card">
            <div className="placeholder-icon">📚</div>
            <h3>Course Management</h3>
            <p>Create and manage course content</p>
          </div>
          
          <div className="placeholder-card">
            <div className="placeholder-icon">💰</div>
            <h3>Payment & Revenue</h3>
            <p>Track payments and financial analytics</p>
          </div>
        </div>
        
        <div className="admin-placeholder-footer">
          <p>Admin features are currently under development.</p>
          <p>Full admin functionality will be available in future updates.</p>
        </div>
      </div>
    </div>
  )
}

export default AdminPlaceholder
