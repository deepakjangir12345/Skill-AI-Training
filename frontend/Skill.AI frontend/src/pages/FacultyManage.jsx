import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import './AdminListPages.css'

const FacultyManage = () => {
  const [searchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyCourses()
    
    // Set course from URL parameter if present
    const courseId = searchParams.get('course')
    if (courseId) {
      setSelectedCourse(courseId)
      fetchCourseVideos(courseId)
    }
  }, [searchParams])

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/api/faculty/my-courses', {
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

  const fetchCourseVideos = async (courseId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get(`/api/faculty/course/${courseId}/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setVideos(response.data)
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId)
    if (courseId) {
      fetchCourseVideos(courseId)
    } else {
      setVideos([])
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
      <div className="admin-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading courses...</p>
      </div>
    )
  }

  return (
    <div className="admin-list-page">
      <h2>Manage Lectures</h2>
      
      <div className="course-selector">
        <label htmlFor="course-select">Select Course:</label>
        <select
          id="course-select"
          value={selectedCourse}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          <option value="">Choose a course to manage videos</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div className="admin-table-container">
          <h3>Videos for {courses.find(c => c._id === selectedCourse)?.name}</h3>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Size</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video._id}>
                  <td className="video-title">{video.title}</td>
                  <td className="video-description">
                    {video.description.length > 80 
                      ? `${video.description.substring(0, 80)}...` 
                      : video.description}
                  </td>
                  <td className="video-size">{formatFileSize(video.size)}</td>
                  <td className="video-date">{formatDate(video.createdAt)}</td>
                  <td className="video-status">
                    <span className={`status-badge ${video.isPublished ? 'published' : 'draft'}`}>
                      {video.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="video-actions">
                    <button className="btn btn-primary btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {videos.length === 0 && (
            <div className="no-data">
              <p>No videos uploaded for this course yet</p>
              <a href={`/faculty/upload?course=${selectedCourse}`} className="btn btn-primary">
                Upload First Video
              </a>
            </div>
          )}
        </div>
      )}

      {!selectedCourse && (
        <div className="no-data">
          <p>Please select a course to manage its videos</p>
        </div>
      )}
    </div>
  )
}

export default FacultyManage
