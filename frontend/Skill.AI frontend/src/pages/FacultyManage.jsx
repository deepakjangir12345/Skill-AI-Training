import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import ConfirmDialog from '../components/ConfirmDialog'
import './FacultyManage.css'

const FacultyManage = () => {
  const [searchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteVideoId, setDeleteVideoId] = useState(null)

  // Edit popup states
  const [editVideo, setEditVideo] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSaving, setEditSaving] = useState(false)

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
      fetchCourseVideos(courseId)
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
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseVideos = async (courseId) => {
    try {
      const token = localStorage.getItem('token')

      const response = await api.get(
        `/faculty/course/${courseId}/videos`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

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

  // =========================
  // EDIT VIDEO
  // =========================

  const handleEditVideo = (video) => {
    setEditVideo(video)
    setEditTitle(video.title || '')
    setEditDescription(video.description || '')
  }

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      return
    }

    try {
      setEditSaving(true)

      const token = localStorage.getItem('token')

      await api.put(
        `/faculty/video/${editVideo._id}`,
        {
          title: editTitle.trim(),
          description: editDescription
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      await fetchCourseVideos(selectedCourse)

      setEditVideo(null)
      setEditTitle('')
      setEditDescription('')

      showMessage(
        'Video Updated',
        'Video updated successfully.'
      )
    } catch (error) {
      console.error('Error updating video:', error)

      setEditVideo(null)

      showMessage(
        'Update Failed',
        error.response?.data?.message ||
          'Failed to update video'
      )
    } finally {
      setEditSaving(false)
    }
  }

  // =========================
  // DELETE VIDEO
  // =========================

  const handleDeleteVideo = (videoId) => {
    setDeleteVideoId(videoId)

    setDialog({
      open: true,
      title: 'Delete Video?',
      message: 'Are you sure you want to delete this video?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      action: handleConfirmDelete,
    })
  }

  const handleConfirmDelete = async () => {
    const videoId = deleteVideoId

    closeDialog()
    setDeleteVideoId(null)

    if (!videoId) {
      return
    }

    try {
      const token = localStorage.getItem('token')

      await api.delete(
        `/faculty/video/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      await fetchCourseVideos(selectedCourse)

      showMessage(
        'Video Deleted',
        'Video deleted successfully.'
      )
    } catch (error) {
      console.error('Error deleting video:', error)

      showMessage(
        'Delete Failed',
        error.response?.data?.message ||
          'Failed to delete video'
      )
    }
  }

  // =========================
  // PUBLISH / UNPUBLISH
  // =========================

  const handleTogglePublish = async (video) => {
    try {
      const token = localStorage.getItem('token')

      await api.put(
        `/faculty/video/${video._id}`,
        {
          isPublished: !video.isPublished
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      await fetchCourseVideos(selectedCourse)

      showMessage(
        video.isPublished
          ? 'Video Unpublished'
          : 'Video Published',
        video.isPublished
          ? 'Video moved to draft successfully.'
          : 'Video published successfully.'
      )
    } catch (error) {
      console.error(
        'Error updating video status:',
        error
      )

      showMessage(
        'Update Failed',
        error.response?.data?.message ||
          'Failed to update video status'
      )
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      'en-IN',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    )
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024

    const sizes = [
      'Bytes',
      'KB',
      'MB',
      'GB'
    ]

    const i = Math.floor(
      Math.log(bytes) / Math.log(k)
    )

    return (
      parseFloat(
        (bytes / Math.pow(k, i)).toFixed(2)
      ) +
      ' ' +
      sizes[i]
    )
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
    <>
      <div className="admin-list-page">

        <h2>Manage Lectures</h2>

        <div className="course-selector">

          <label htmlFor="course-select">
            Select Course:
          </label>

          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) =>
              handleCourseChange(e.target.value)
            }
          >
            <option value="">
              Choose a course to manage videos
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

        {selectedCourse && (
          <div className="admin-table-container">

            <h3>
              Videos for{' '}
              {
                courses.find(
                  (c) =>
                    c._id === selectedCourse
                )?.name
              }
            </h3>

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

                    <td className="video-title">
                      {video.title}
                    </td>

                    <td className="video-description">
                      {(video.description || '').length > 80
                        ? `${video.description.substring(
                            0,
                            80
                          )}...`
                        : video.description || ''}
                    </td>

                    <td className="video-size">
                      {formatFileSize(video.size)}
                    </td>

                    <td className="video-date">
                      {formatDate(video.createdAt)}
                    </td>

                    <td className="video-status">

                      <span
                        className={`status-badge ${
                          video.isPublished
                            ? 'published'
                            : 'draft'
                        }`}
                      >
                        {video.isPublished
                          ? 'Published'
                          : 'Draft'}
                      </span>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          handleTogglePublish(video)
                        }
                        style={{
                          marginLeft: '8px'
                        }}
                      >
                        {video.isPublished
                          ? 'Unpublish'
                          : 'Publish'}
                      </button>

                    </td>

                    <td className="video-actions">

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          handleEditVideo(video)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDeleteVideo(video._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {videos.length === 0 && (
              <div className="no-data">

                <p>
                  No videos uploaded for this course yet
                </p>

                <a
                  href={`/faculty/upload?course=${selectedCourse}`}
                  className="btn btn-primary"
                >
                  Upload First Video
                </a>

              </div>
            )}

          </div>
        )}

        {!selectedCourse && (
          <div className="no-data">
            <p>
              Please select a course to manage its videos
            </p>
          </div>
        )}

      </div>

      {/* =========================
          EDIT VIDEO POPUP
      ========================= */}

      {editVideo && (
        <div
          className="faculty-edit-overlay"
          onClick={() => {
            if (!editSaving) {
              setEditVideo(null)
            }
          }}
        >

          <div
            className="faculty-edit-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="faculty-edit-icon">
              ✏️
            </div>

            <h3>Edit Video</h3>

            <p className="faculty-edit-subtitle">
              Update your lecture details
            </p>

            <div className="faculty-edit-field">

              <label>
                Video Title
              </label>

              <input
                type="text"
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
                placeholder="Enter video title"
                disabled={editSaving}
              />

            </div>

            <div className="faculty-edit-field">

              <label>
                Description
              </label>

              <textarea
                value={editDescription}
                onChange={(e) =>
                  setEditDescription(e.target.value)
                }
                placeholder="Enter video description"
                rows="5"
                disabled={editSaving}
              />

            </div>

            <div className="faculty-edit-actions">

              <button
                type="button"
                className="faculty-edit-cancel"
                onClick={() => setEditVideo(null)}
                disabled={editSaving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="faculty-edit-save"
                onClick={handleSaveEdit}
                disabled={
                  editSaving ||
                  !editTitle.trim()
                }
              >
                {editSaving
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Existing confirmation / message dialog */}
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

export default FacultyManage