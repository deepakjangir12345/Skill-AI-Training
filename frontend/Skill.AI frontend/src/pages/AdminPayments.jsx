import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import './AdminListPages.css'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/api/admin/payments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setPayments(response.data)
    } catch (error) {
      console.error('Error fetching payments:', error)
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="admin-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading payments...</p>
      </div>
    )
  }

  return (
    <div className="admin-list-page">
      <h2>Payments Management</h2>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="payment-user">
                  {payment.userId?.name || 'Unknown User'}
                </td>
                <td className="payment-course">
                  {payment.courseId?.name || 'Unknown Course'}
                </td>
                <td className="payment-amount">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="payment-status">
                  <span className={`status-badge ${payment.status}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="payment-date">
                  {formatDate(payment.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {payments.length === 0 && (
          <div className="no-data">
            <p>No payments found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPayments
