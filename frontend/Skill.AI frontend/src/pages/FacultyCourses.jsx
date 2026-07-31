import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import './AdminListPages.css'

const FacultyCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyCourses()
  }, [])

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/faculty/my-courses', {
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
      <h2>My Assigned Courses</h2>
      
      {courses.length === 0 ? (
        <div className="no-data">
          <p>No courses assigned to you yet</p>
          <p>Contact the admin to get course assignments</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-card-content">
                <h3 className="course-name">{course.name}</h3>
                <p className="course-description">
                  {course.description.length > 150 
                    ? `${course.description.substring(0, 150)}...` 
                    : course.description}
                </p>
                <div className="course-meta">
                  <span className="course-price">₹{course.price}</span>
                  <span className="course-status">Active</span>
                </div>
                <div className="course-notice">
                  <p>📹 Video upload coming soon</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FacultyCourses
