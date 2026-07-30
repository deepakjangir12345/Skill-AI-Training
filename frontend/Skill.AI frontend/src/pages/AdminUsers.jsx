import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import './AdminListPages.css'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
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
        <p>Loading users...</p>
      </div>
    )
  }

  return (
    <div className="admin-list-page">
      <h2>Users Management</h2>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="user-name">{user.name}</td>
                <td className="user-email">{user.email}</td>
                <td className="user-role">
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td className="user-date">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="no-data">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
