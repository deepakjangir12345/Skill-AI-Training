import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import { COURSE_PRICES } from "../config/coursePrices.js";

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================
// CREATE ORDER
// ============================
export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Validate course
    if (!COURSE_PRICES[courseId]) {
      return res.status(400).json({ message: "Invalid course" });
    }

    // Amount
    const amount = COURSE_PRICES[courseId]; // ₹
    const amountInPaise = amount * 100;     // Razorpay needs paise

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: "ord" + Math.floor(Math.random() * 1000000)
    });

    // Save order in DB
    await Payment.create({
      userId,
      courseId,
      razorpay_order_id: order.id,
      amount: amountInPaise,
      status: "created",
    });

    return res.json({
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
    });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ message: "Order creation failed" });
  }
};

// ============================
// VERIFY PAYMENT
// ============================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const userId = req.user.id;

    // Generate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update payment
    await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        status: "success",
      }
    );

    // Enroll user
    const alreadyEnrolled = await Enrollment.findOne({ userId, courseId });
    if (!alreadyEnrolled) {
      const newEnrollment=await Enrollment.create({
        
  userId,
  user: userId,
  courseId,
  course: courseId,
  paymentId: razorpay_payment_id,
  enrolledAt: new Date(),
});
console.log("NEW ENROLLMENT =", newEnrollment);
    }

    return res.json({ message: "Payment verified & enrolled successfully" });
  } catch (err) {
    console.error("Verify payment error:", err);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};

