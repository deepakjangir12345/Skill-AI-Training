const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const authMiddleware = require("../middleware/auth.Middleware");
const Payment = require("../models/Payment");
const Enrollment = require("../models/Enrollment");

// Create Razorpay Order
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    const userId = req.user._id;

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_SECRET === "your_secret_key_here"
    ) {
      return res.status(500).json({ message: "Razorpay is not configured" });
    }

    // Validate input
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Use amount from frontend or fallback to default
    const finalAmount = amount || 599;

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: "INR",
      receipt: `ord${Date.now().toString().slice(-6)}`,
      notes: {
        userId: userId.toString(),
        courseId: courseId,
      },
    });

    // Save payment record with 'created' status
    const payment = new Payment({
      userId,
      courseId,
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created"
    });

    await payment.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// Verify Razorpay Payment
console.log("======= PAYMENT VERIFY ROUTE HIT =======");
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const userId = req.user._id;

    if (
      !process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_SECRET === "your_secret_key_here"
    ) {
      return res.status(500).json({ message: "Razorpay is not configured" });
    }

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      return res.status(400).json({ message: "All payment details are required" });
    }

    // Find the payment record
    const payment = await Payment.findOne({ 
      razorpay_order_id, 
      userId, 
      courseId 
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (payment.status === 'success') {
      return res.json({ success: true, message: "Payment already verified" });
    }

    if (payment.status === 'failed') {
      return res.status(400).json({ message: "Payment verification previously failed" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const is_valid = generated_signature === razorpay_signature;

    if (!is_valid) {
      // Update payment status to failed
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'failed',
        razorpay_payment_id,
        razorpay_signature
      });
      return res.status(400).json({ message: "Payment verification failed - invalid signature" });
    }

    // Update payment status to success
    const updatedPayment = await Payment.findByIdAndUpdate(payment._id, {
      status: 'success',
      razorpay_payment_id,
      razorpay_signature
    }, { new: true });

    // Create enrollment
    try {
      const enrollment = new Enrollment({
  userId,
  user: userId,

  courseId,
  course: courseId,

  paymentId: payment._id,
  enrolledAt: new Date()
});
      await enrollment.save();
      console.log("SAVED ENROLLMENT:", enrollment);
      console.log("NEW ENROLLMENT =", enrollment);
    } catch (enrollmentError) {
      // Handle duplicate enrollment error
      if (enrollmentError.code === 11000) {
        console.log('User already enrolled, continuing...');
      } else {
        throw enrollmentError;
      }
    }

    res.json({ 
      success: true, 
      message: "Payment verified successfully. You are now enrolled!" 
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

module.exports = router;
