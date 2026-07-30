import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './AdminSupportPage.css'

const AdminSupportPage = () => {
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQueries: 0,
    hasNext: false,
    hasPrev: false
  })
  const [statusFilter, setStatusFilter] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchQueries()
  }, [pagination.currentPage, statusFilter])

  const fetchQueries = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...(statusFilter && { status: statusFilter })
      })
      
      const response = await api.get(`/api/support/queries?${params}`)
      
      if (response.data.success) {
        setQueries(response.data.queries)
        setPagination(response.data.pagination)
      } else {
        toast.error('Failed to fetch support queries')
      }
    } catch (error) {
      console.error('Error fetching support queries:', error)
      toast.error('Failed to fetch support queries')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (queryId, newStatus) => {
    try {
      setUpdatingId(queryId)
      const response = await api.put(`/api/support/queries/${queryId}`, {
        status: newStatus
      })
      
      if (response.data.success) {
        toast.success('Query status updated successfully')
        fetchQueries() // Refresh the list
      } else {
        toast.error(response.data.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating query status:', error)
      toast.error('Failed to update query status')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return '#ef4444'
      case 'In Progress': return '#f59e0b'
      case 'Resolved': return '#10b981'
      case 'Closed': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }))
    }
  }

  if (loading) {
    return (
      <div className="admin-support-page">
        <Navbar />
        <main className="admin-support-main">
          <div className="container">
            <div className="spinner"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="admin-support-page">
      <Navbar />
      <main className="admin-support-main">
        <div className="container">
          <div className="admin-header">
            <h1 className="page-title">Support Queries Management</h1>
            <p className="page-subtitle">
              Manage and respond to user support queries
            </p>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <div className="filter-group">
              <label htmlFor="statusFilter">Filter by Status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPagination(prev => ({ ...prev, currentPage: 1 }))
                }}
              >
                <option value="">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Queries Table */}
          <div className="admin-table-container">
            {queries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h2>No support queries found</h2>
                <p>Queries submitted by users will appear here</p>
              </div>
            ) : (
              <div className="admin-table">
                <div className="table-header">
                  <div className="table-cell">Name</div>
                  <div className="table-cell">Email</div>
                  <div className="table-cell">Subject</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Created</div>
                  <div className="table-cell">Actions</div>
                </div>
                
                {queries.map((query) => (
                  <div key={query._id} className="table-row">
                    <div className="table-cell">
                      <div className="query-name">{query.name}</div>
                    </div>
                    <div className="table-cell">
                      <div className="query-email">{query.email}</div>
                    </div>
                    <div className="table-cell">
                      <div className="query-subject">{query.subject}</div>
                    </div>
                    <div className="table-cell">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(query.status) }}
                      >
                        {query.status}
                      </span>
                    </div>
                    <div className="table-cell">
                      <div className="query-date">{formatDate(query.createdAt)}</div>
                    </div>
                    <div className="table-cell">
                      <select
                        value={query.status}
                        onChange={(e) => handleStatusChange(query._id, e.target.value)}
                        disabled={updatingId === query._id}
                        className="status-select"
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                      {updatingId === query._id && (
                        <div className="updating-indicator">Updating...</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                className="btn btn-outline"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </button>
            </div>
          )}

          {/* Summary Stats */}
          <div className="admin-summary">
            <div className="summary-card">
              <h3>Summary</h3>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Queries:</span>
                  <span className="stat-value">{pagination.totalQueries}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Current Page:</span>
                  <span className="stat-value">{pagination.currentPage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdminSupportPage
