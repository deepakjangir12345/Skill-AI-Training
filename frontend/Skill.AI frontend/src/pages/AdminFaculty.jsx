import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import './AdminFaculty.css'

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    fetchFaculty()
    fetchCourses()
  }, [])

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await api.get('/admin/faculty', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setFaculty(response.data)
    } catch (error) {
      console.error('Error fetching faculty:', error)
    }
  }

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await api.get('/admin/courses', {
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

  const handleAssignCourse = async () => {
    if (!selectedFaculty || !selectedCourse) {
      alert('Please select faculty and course')
      return
    }

    try {
      setAssigning(true)

      const token = localStorage.getItem('token')

      await api.post(
        '/admin/faculty/assign-course',
        {
          facultyId: selectedFaculty,
          courseId: selectedCourse
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert('Course assigned to faculty successfully')

      setSelectedFaculty('')
      setSelectedCourse('')

      await fetchFaculty()
    } catch (error) {
      console.error('Error assigning course:', error)

      alert(
        error.response?.data?.message ||
        'Failed to assign course'
      )
    } finally {
      setAssigning(false)
    }
  }

  const handleRemoveCourse = async (courseId) => {
    const confirmRemove = window.confirm(
      'Are you sure you want to remove this faculty assignment?'
    )

    if (!confirmRemove) {
      return
    }

    try {
      const token = localStorage.getItem('token')

      await api.delete(
        `/admin/faculty/remove-from-course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert('Faculty removed from course successfully')

      await fetchFaculty()
    } catch (error) {
      console.error('Error removing faculty:', error)

      alert(
        error.response?.data?.message ||
        'Failed to remove faculty'
      )
    }
  }

  if (loading) {
    return (
      <div className="admin-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading faculty...</p>
      </div>
    )
  }

  return (
    <div className="admin-list-page">

      <h2>Faculty Management</h2>

      {/* Assign Course Section */}
      <div
        style={{
          background: '#fff',
          padding: '20px',
          marginBottom: '25px',
          borderRadius: '10px',
          border: '1px solid #ddd'
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          Assign Course to Faculty
        </h3>

        <div
          style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >

          <select
            value={selectedFaculty}
            onChange={(event) =>
              setSelectedFaculty(event.target.value)
            }
            className="role-select"
          >
            <option value="">
              Select Faculty
            </option>

            {faculty.map((member) => (
              <option
                key={member._id}
                value={member._id}
              >
                {member.name} ({member.email})
              </option>
            ))}
          </select>

          <select
            value={selectedCourse}
            onChange={(event) =>
              setSelectedCourse(event.target.value)
            }
            className="role-select"
          >
            <option value="">
              Select Course
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

          <button
            onClick={handleAssignCourse}
            disabled={assigning}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderRadius: '6px',
              cursor: assigning ? 'not-allowed' : 'pointer'
            }}
          >
            {assigning ? 'Assigning...' : 'Assign Course'}
          </button>

        </div>
      </div>

      {/* Faculty List */}
      <div className="admin-table-container">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Assigned Courses</th>
            </tr>
          </thead>

          <tbody>

            {faculty.map((member) => (

              <tr key={member._id}>

                <td className="user-name">
                  {member.name}
                </td>

                <td className="user-email">
                  {member.email}
                </td>

                <td>
                  {member.courseCount || 0}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {faculty.length === 0 && (
          <div className="no-data">
            <p>No faculty users found</p>
          </div>
        )}

      </div>

    </div>
  )
}

export default AdminFaculty