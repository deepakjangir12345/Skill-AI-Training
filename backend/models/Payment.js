const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  razorpay_order_id: {
    type: String,
    required: true,
    unique: true
  },
  razorpay_payment_id: {
    type: String,
    sparse: true
  },
  razorpay_signature: {
    type: String,
    sparse: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'success', 'failed'],
    default: 'created'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
