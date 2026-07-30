// Support controller for handling user queries
const Support = require('../models/Support');

const submitSupportQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Save support query to database
    const supportQuery = new Support({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'New'
    });

    await supportQuery.save();

    // Log the support query
    console.log('Support Query Received:', {
      timestamp: new Date().toISOString(),
      name,
      email,
      subject,
      message
    });

    // In production, you would also:
    // 1. Send email notification to support team
    // 2. Send confirmation email to user
    // 3. Create ticket in support system

    res.json({
      success: true,
      message: 'Support query submitted successfully. We will get back to you within 24 hours.'
    });
  } catch (error) {
    console.error('Error submitting support query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit support query'
    });
  }
};

// Admin only: Get all support queries
const getAllSupportQueries = async (req, res) => {
  try {
    // In production, you should verify admin role here
    // For now, we'll assume the user is authenticated and authorized
    
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Build query filter
    const filter = {};
    if (status) {
      filter.status = status;
    }

    // Get queries with pagination
    const queries = await Support.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v'); // Exclude version field

    // Get total count for pagination
    const total = await Support.countDocuments(filter);

    res.json({
      success: true,
      queries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalQueries: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching support queries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support queries'
    });
  }
};

// Admin only: Update query status
const updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updatedQuery = await Support.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedQuery) {
      return res.status(404).json({
        success: false,
        message: 'Support query not found'
      });
    }

    res.json({
      success: true,
      message: 'Query status updated successfully',
      query: updatedQuery
    });
  } catch (error) {
    console.error('Error updating query status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update query status'
    });
  }
};

module.exports = {
  submitSupportQuery,
  getAllSupportQueries,
  updateQueryStatus
};
