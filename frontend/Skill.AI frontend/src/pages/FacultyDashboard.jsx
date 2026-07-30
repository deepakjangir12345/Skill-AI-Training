import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import './FacultyDashboard.css'

const FacultyDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalVideos: 0,
    totalSize: 0,
    recentUploads: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/api/faculty/my-courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const courses = response.data
      let totalVideos = 0
      let totalSize = 0
      let recentUploads = 0

      // Calculate stats from courses (simplified for now)
      courses.forEach(course => {
        // These would come from video data in a real implementation
        totalVideos += Math.floor(Math.random() * 10) // Mock data
        totalSize += Math.floor(Math.random() * 1000000) // Mock data in bytes
      })

      recentUploads = Math.floor(Math.random() * 5) // Mock recent uploads

      setStats({
        totalCourses: courses.length,
        totalVideos,
        totalSize,
        recentUploads
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="faculty-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="faculty-dashboard">
      <h2>Faculty Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3>
            <p>Assigned Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📹</div>
          <div className="stat-content">
            <h3>{stats.totalVideos}</h3>
            <p>Total Videos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-content">
            <h3>{formatFileSize(stats.totalSize)}</h3>
            <p>Total Storage</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🕒</div>
          <div className="stat-content">
            <h3>{stats.recentUploads}</h3>
            <p>Recent Uploads</p>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <h3>Faculty Overview</h3>
        <p>Welcome to the Faculty Dashboard. This is your dedicated workspace for managing course content and uploading educational videos.</p>
        <div className="info-cards">
          <div className="info-card">
            <h4>📹 Video Management</h4>
            <p>Upload and manage video lectures for your assigned courses.</p>
          </div>
          <div className="info-card">
            <h4>📚 Course Content</h4>
            <p>Organize and structure course materials effectively.</p>
          </div>
          <div className="info-card">
            <h4>📊 Performance Tracking</h4>
            <p>Monitor your content and student engagement metrics.</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <a href="/faculty/upload" className="action-btn primary">
            <span className="btn-icon">📹</span>
            Upload New Video
          </a>
          <a href="/faculty/courses" className="action-btn secondary">
            <span className="btn-icon">📚</span>
            View My Courses
          </a>
          <a href="/faculty/manage" className="action-btn secondary">
            <span className="btn-icon">⚙️</span>
            Manage Lectures
          </a>
        </div>
      </div>
    </div>
  )
}

export default FacultyDashboard
