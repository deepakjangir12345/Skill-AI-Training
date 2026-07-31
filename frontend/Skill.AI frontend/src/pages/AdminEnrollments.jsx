import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import './AdminListPages.css'

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/admin/enrollments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setEnrollments(response.data)
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="admin-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading enrollments...</p>
      </div>
    )
  }

  return (
    <div className="admin-list-page">
      <h2>Enrollments Management</h2>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Course</th>
              <th>Price</th>
              <th>Enrollment Date</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment._id}>
                <td className="enrollment-user">
                  {enrollment.userId?.name || 'Unknown User'}
                </td>
                <td className="enrollment-course">
                  {enrollment.courseId?.name || 'Unknown Course'}
                </td>
                <td className="enrollment-price">
                  ₹{enrollment.courseId?.price || 0}
                </td>
                <td className="enrollment-date">
                  {formatDate(enrollment.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {enrollments.length === 0 && (
          <div className="no-data">
            <p>No enrollments found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminEnrollments
