import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import './AdminListPages.css'

const AdminCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/api/admin/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setCourses(response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
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
        <p>Loading courses...</p>
      </div>
    )
  }

  return (
    <div className="admin-list-page">
      <h2>Courses Management</h2>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="course-name">{course.name}</td>
                <td className="course-description">
                  {course.description.length > 100 
                    ? `${course.description.substring(0, 100)}...` 
                    : course.description}
                </td>
                <td className="course-price">₹{course.price}</td>
                <td className="course-date">{formatDate(course.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {courses.length === 0 && (
          <div className="no-data">
            <p>No courses found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCourses
