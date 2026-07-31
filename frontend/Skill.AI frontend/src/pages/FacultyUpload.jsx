import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import './FacultyUpload.css'

const FacultyUpload = () => {
  const [searchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    fetchMyCourses()
    
    // Set course from URL parameter if present
    const courseId = searchParams.get('course')
    if (courseId) {
      setSelectedCourse(courseId)
    }
  }, [searchParams])

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
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file')
        return
      }
      
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file size should be less than 100MB')
        return
      }
      
      setVideoFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedCourse || !title || !videoFile) {
      alert('Please fill all required fields')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('title', title)
      formData.append('description', description)

      const response = await api.post(
        `/api/faculty/course/${selectedCourse}/upload-video`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setUploadProgress(progress)
          }
        }
      )

      alert('Video uploaded successfully!')
      
      // Reset form
      setTitle('')
      setDescription('')
      setVideoFile(null)
      setUploadProgress(0)
      
      // Reset file input
      document.getElementById('video-input').value = ''
      
    } catch (error) {
      console.error('Error uploading video:', error)
      alert('Failed to upload video. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="faculty-upload">
      <h2>Upload Video</h2>
      
      <div className="upload-form-container">
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="course">Select Course *</label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
              disabled={uploading}
            >
              <option value="">Choose a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Video Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              required
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description (optional)"
              rows="4"
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-input">Video File *</label>
            <input
              type="file"
              id="video-input"
              accept="video/*"
              onChange={handleFileChange}
              required
              disabled={uploading}
            />
            <small className="form-help">
              Supported formats: MP4, AVI, MOV, etc. Max size: 100MB
            </small>
          </div>

          {videoFile && (
            <div className="file-preview">
              <h4>Selected File:</h4>
              <p><strong>Name:</strong> {videoFile.name}</p>
              <p><strong>Size:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              <p><strong>Type:</strong> {videoFile.type}</p>
            </div>
          )}

          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>Uploading... {uploadProgress}%</p>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setTitle('')
                setDescription('')
                setVideoFile(null)
                setUploadProgress(0)
                document.getElementById('video-input').value = ''
              }}
              disabled={uploading}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FacultyUpload
