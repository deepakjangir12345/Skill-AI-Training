import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import ConfirmDialog from '../components/ConfirmDialog'
import './FacultyUpload.css'

const FacultyUpload = () => {
  const [searchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [modules, setModules] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedModule, setSelectedModule] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Okay',
    cancelText: '',
    action: null,
  })

  useEffect(() => {
    fetchMyCourses()

    const courseId = searchParams.get('course')

    if (courseId) {
      setSelectedCourse(courseId)
    }
  }, [searchParams])

  const closeDialog = () => {
    setDialog({
      open: false,
      title: '',
      message: '',
      confirmText: 'Okay',
      cancelText: '',
      action: null,
    })
  }

  const showMessage = (title, message) => {
    setDialog({
      open: true,
      title,
      message,
      confirmText: 'Okay',
      cancelText: '',
      action: closeDialog,
    })
  }

  // Fetch faculty's assigned courses
  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await api.get('/faculty/my-courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCourses(response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  // Fetch modules whenever course changes
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseModules(selectedCourse)
    } else {
      setModules([])
      setSelectedModule('')
    }
  }, [selectedCourse])

  // Get modules for selected course
  const fetchCourseModules = async (courseId) => {
    try {
      const token = localStorage.getItem('token')

      const response = await api.get(
        `/faculty/course/${courseId}/modules`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setModules(response.data.modules || [])
      setSelectedModule('')
    } catch (error) {
      console.error('Error fetching course modules:', error)
      setModules([])
      setSelectedModule('')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]

    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        showMessage(
          'Invalid File',
          'Please select a video file.'
        )

        e.target.value = ''
        return
      }

      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        showMessage(
          'File Too Large',
          'Video file size should be less than 100MB.'
        )

        e.target.value = ''
        return
      }

      setVideoFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !selectedCourse ||
      !selectedModule ||
      !title ||
      !videoFile
    ) {
      showMessage(
        'Required Fields',
        'Please fill all required fields.'
      )
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
      formData.append('module', selectedModule)

      await api.post(
        `/faculty/course/${selectedCourse}/upload-video`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },

          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) /
                progressEvent.total
            )

            setUploadProgress(progress)
          }
        }
      )

      // Reset form
      setTitle('')
      setDescription('')
      setVideoFile(null)
      setSelectedModule('')
      setUploadProgress(0)

      // Reset file input
      const input = document.getElementById('video-input')

      if (input) {
        input.value = ''
      }

      showMessage(
        'Video Uploaded',
        'Video uploaded successfully!'
      )

    } catch (error) {
      console.error(
        'Error uploading video:',
        error
      )

      showMessage(
        'Upload Failed',
        error.response?.data?.message ||
          'Failed to upload video. Please try again.'
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="faculty-upload">

        <h2>Upload Video</h2>

        <div className="upload-form-container">

          <form
            onSubmit={handleSubmit}
            className="upload-form"
          >

            {/* Course */}
            <div className="form-group">

              <label htmlFor="course">
                Select Course *
              </label>

              <select
                id="course"
                value={selectedCourse}
                onChange={(e) =>
                  setSelectedCourse(e.target.value)
                }
                required
                disabled={uploading}
              >

                <option value="">
                  Choose a course
                </option>

                {courses.map((course) => (
                  <option
                    key={course._id}
                    value={course._id}
                  >
                    {course.name}
                  </option>
                ))}

              </select>

            </div>

            {/* Module */}
            <div className="form-group">

              <label htmlFor="module">
                Select Module *
              </label>

              <select
                id="module"
                value={selectedModule}
                onChange={(e) =>
                  setSelectedModule(e.target.value)
                }
                required
                disabled={
                  uploading ||
                  !selectedCourse
                }
              >

                <option value="">
                  {!selectedCourse
                    ? 'Select a course first'
                    : modules.length === 0
                      ? 'No modules available'
                      : 'Choose a module'
                  }
                </option>

                {modules.map((module) => (
                  <option
                    key={module._id}
                    value={module._id}
                  >
                    {module.order}. {module.title}
                  </option>
                ))}

              </select>

              {selectedCourse &&
                modules.length === 0 && (
                  <small className="form-help">
                    No modules are available for this course.
                    Please ask the admin to create a module first.
                  </small>
                )}

            </div>

            {/* Title */}
            <div className="form-group">

              <label htmlFor="title">
                Video Title *
              </label>

              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter video title"
                required
                disabled={uploading}
              />

            </div>

            {/* Description */}
            <div className="form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Enter video description (optional)"
                rows="4"
                disabled={uploading}
              />

            </div>

            {/* Video */}
            <div className="form-group">

              <label htmlFor="video-input">
                Video File *
              </label>

              <input
                type="file"
                id="video-input"
                accept="video/*"
                onChange={handleFileChange}
                required
                disabled={uploading}
              />

              <small className="form-help">
                Supported formats: MP4, AVI, MOV, etc.
                Max size: 100MB
              </small>

            </div>

            {/* File Preview */}
            {videoFile && (
              <div className="file-preview">

                <h4>Selected File:</h4>

                <p>
                  <strong>Name:</strong>{' '}
                  {videoFile.name}
                </p>

                <p>
                  <strong>Size:</strong>{' '}
                  {(
                    videoFile.size /
                    (1024 * 1024)
                  ).toFixed(2)} MB
                </p>

                <p>
                  <strong>Type:</strong>{' '}
                  {videoFile.type}
                </p>

              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="upload-progress">

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${uploadProgress}%`
                    }}
                  />

                </div>

                <p>
                  Uploading... {uploadProgress}%
                </p>

              </div>
            )}

            {/* Actions */}
            <div className="form-actions">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  uploading ||
                  !selectedModule
                }
              >
                {uploading
                  ? 'Uploading...'
                  : 'Upload Video'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setTitle('')
                  setDescription('')
                  setVideoFile(null)
                  setSelectedModule('')
                  setUploadProgress(0)

                  const input =
                    document.getElementById(
                      'video-input'
                    )

                  if (input) {
                    input.value = ''
                  }
                }}
                disabled={uploading}
              >
                Clear Form
              </button>

            </div>

          </form>

        </div>

      </div>

      <ConfirmDialog
        open={dialog.open}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        onConfirm={dialog.action}
        onCancel={closeDialog}
      />
    </>
  )
}

export default FacultyUpload