import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import './AdminFaculty.css'
import ConfirmDialog from "../components/ConfirmDialog";

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({
  open: false,
  title: "",
  message: "",
  confirmText: "Okay",
  cancelText: "Cancel",
  action: null,
});

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
    setConfirmDialog({
      open: true,
      title: "Missing Selection",
      message: "Please select both faculty and course before assigning.",
      confirmText: "Okay",
      cancelText: "",
      action: () => {
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          action: null,
        });
      },
    });
    return;
  }

  try {
    setAssigning(true);

    const token = localStorage.getItem("token");

    await api.post(
      "/admin/faculty/assign-course",
      {
        facultyId: selectedFaculty,
        courseId: selectedCourse,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSelectedFaculty("");
    setSelectedCourse("");

    await fetchFaculty();

    setConfirmDialog({
      open: true,
      title: "Course Assigned",
      message: "Course assigned to faculty successfully.",
      confirmText: "Done",
      cancelText: "",
      action: () => {
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          action: null,
        });
      },
    });
  } catch (error) {
    console.error("Error assigning course:", error);

    setConfirmDialog({
      open: true,
      title: "Assignment Failed",
      message:
        error.response?.data?.message ||
        "Failed to assign course.",
      confirmText: "Okay",
      cancelText: "",
      action: () => {
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          action: null,
        });
      },
    });
  } finally {
    setAssigning(false);
  }
};

  const handleRemoveCourse = async (courseId) => {
  setConfirmDialog({
    open: true,
    title: "Remove Faculty Assignment?",
    message:
      "Are you sure you want to remove this faculty assignment?",
    confirmText: "Remove",
    cancelText: "Cancel",
    action: async () => {
      setConfirmDialog({
        open: false,
        title: "",
        message: "",
        action: null,
      });

      try {
        const token = localStorage.getItem("token");

        await api.delete(
          `/admin/faculty/remove-from-course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchFaculty();

        setConfirmDialog({
          open: true,
          title: "Assignment Removed",
          message: "Faculty removed from course successfully.",
          confirmText: "Done",
          cancelText: "",
          action: () => {
            setConfirmDialog({
              open: false,
              title: "",
              message: "",
              action: null,
            });
          },
        });
      } catch (error) {
        console.error("Error removing faculty:", error);

        setConfirmDialog({
          open: true,
          title: "Removal Failed",
          message:
            error.response?.data?.message ||
            "Failed to remove faculty.",
          confirmText: "Okay",
          cancelText: "",
          action: () => {
            setConfirmDialog({
              open: false,
              title: "",
              message: "",
              action: null,
            });
          },
        });
      }
    },
  });
};

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

          <ConfirmDialog
  open={confirmDialog.open}
  title={confirmDialog.title}
  message={confirmDialog.message}
  confirmText={confirmDialog.confirmText}
  cancelText={confirmDialog.cancelText}
  onConfirm={confirmDialog.action}
  onCancel={() =>
    setConfirmDialog({
      open: false,
      title: "",
      message: "",
      action: null,
    })
  }
/>

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
  {member.assignedCourses && member.assignedCourses.length > 0 ? (
    <div className="faculty-assigned-courses">
      {member.assignedCourses.map((course) => (
        <div
          key={course._id}
          className="faculty-course-item"
        >
          <span>{course.name}</span>

          <button
            type="button"
            className="faculty-remove-course-btn"
            onClick={() => handleRemoveCourse(course._id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  ) : (
    <span>0</span>
  )}
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