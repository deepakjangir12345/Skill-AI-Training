import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import './AdminDashboard.css'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalPayments: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.totalEnrollments}</h3>
            <p>Total Enrollments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-content">
            <h3>{stats.totalPayments}</h3>
            <p>Total Payments</p>
          </div>
        </div>

        <div className="stat-card revenue-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>
        <div className="dashboard-actions">

  <Link to="/admin/courses" className="admin-action-card">
    <div className="action-icon">📚</div>
    <div>
      <h3>Course Management</h3>
      <p>Create and manage courses</p>
    </div>
  </Link>

  <Link to="/admin/lessons" className="admin-action-card">
    <div className="action-icon">📖</div>
    <div>
      <h3>Manage Lessons</h3>
      <p>Add and manage course lessons</p>
    </div>
  </Link>

</div>

      <div className="dashboard-info">
        <h3>Platform Overview</h3>
        <p>Welcome to the Skill.AI Admin Dashboard. This is a view-only monitoring panel where you can track the platform's performance and user activity.</p>
        <div className="info-cards">
          <div className="info-card">
            <h4>📈 Growth Metrics</h4>
            <p>Monitor user growth, course popularity, and revenue trends.</p>
          </div>
          <div className="info-card">
            <h4>🎯 User Engagement</h4>
            <p>Track enrollments and course completion rates.</p>
          </div>
          <div className="info-card">
            <h4>💼 Business Insights</h4>
            <p>View payment data and revenue analytics.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
