const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const axios = require("axios");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Google OAuth client
const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});  

exports.register = async (req, res) => {
  try {
    console.log('Registration attempt:', { email: req.body.email });
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log('User registered successfully:', { userId: user._id, email });
    
    res.status(201).json({ 
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email });
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', { email });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch:', { email });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log('User logged in successfully:', { userId: user._id, email });

    res.json({ 
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ 
      message: "Token verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Server error during token verification" });
  }
};

// Google OAuth - Get auth URL
exports.googleAuth = async (req, res) => {
  try {
    const authUrl = googleClient.generateAuthUrl({
      access_type: "offline",
      prompt: "select_account",   // 👈 Ye line add karni hai
      scope: ["profile", "email"],
       include_granted_scopes: true,
    });

    res.json({ authUrl });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      message: "Failed to generate Google auth URL",
    });
  }
};

// Google OAuth - Callback
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ message: "Authorization code not provided" });
    }

    const { tokens } = await googleClient.getToken(code);
    
    // Get user info from Google
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { name, email } = ticket.getPayload();
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Existing user - log them in
      if (user.authProvider !== 'google') {
        // Update auth provider for existing email user
        await User.findByIdAndUpdate(user._id, { authProvider: 'google' });
      }
    } else {
      // New user - create account
      user = await User.create({
        name,
        email,
        authProvider: 'google',
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log('Google login successful:', { userId: user._id, email });
   
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    return res.redirect(
      `${frontendUrl}/google-auth-success?token=${token}`
    );
 
     } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};


// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const senderEmail = process.env.EMAIL_FROM;
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!senderEmail) {
      return res.status(500).json({ message: "EMAIL_FROM is not configured" });
    }

    if (!brevoApiKey) {
      return res.status(500).json({ message: "BREVO_API_KEY is not configured" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const requestJson = {
      sender: {
        name: "Skill.AI Training",
        email: senderEmail,
      },
      to: [
        {
          email: user.email,
          name: user.name,
        },
      ],
      subject: "Reset Your Password - Skill.AI Training",
      htmlContent: `
        <h2>Password Reset</h2>

        <p>Hello ${user.name},</p>

        <p>You requested to reset your password.</p>

        <p>
          <a href="${resetUrl}"
             style="
               background:#4f46e5;
               color:#ffffff;
               padding:12px 24px;
               text-decoration:none;
               border-radius:6px;
               display:inline-block;">
            Reset Password
          </a>
        </p>

        <p>This link will expire in 10 minutes.</p>
      `,
    };

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": brevoApiKey,
    };

    console.log("========== BREVO REQUEST ==========");
    console.log("EMAIL_FROM:", senderEmail);
    console.log("BREVO_API_KEY exists:", !!brevoApiKey);
    console.log("sender.email:", requestJson.sender.email);
    console.log("Request JSON:", JSON.stringify(requestJson, null, 2));
    console.log("Headers:", JSON.stringify(headers, null, 2));

  console.log("FINAL REQUEST:");
console.log(requestJson);

  await resend.emails.send({
  from: "Skill.AI Training <onboarding@resend.dev>",
  to: user.email,
  subject: "Reset Your Password - Skill.AI Training",
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
      <h2>Password Reset</h2>

      <p>Hello ${user.name},</p>

      <p>You requested to reset your password.</p>

      <a href="${resetUrl}"
        style="
        background:#4f46e5;
        color:#fff;
        padding:12px 24px;
        border-radius:6px;
        text-decoration:none;
        display:inline-block;
        ">
        Reset Password
      </a>

      <p style="margin-top:20px;">
        This link expires in 10 minutes.
      </p>
    </div>
  `,
});

console.log("✅ Resend Email Sent");

    return res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.log("❌ RESEND ERROR");
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
    console.log("Message:", error.message);

    return res.status(500).json({
      message: "Failed to process password reset request",
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
    
    console.log('Password reset successful:', { userId: user._id, email: user.email });
    
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};