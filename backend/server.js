
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const courseController = require("./controllers/course.Controller");
const configRoutes = require("./routes/config.routes");
const supportRoutes = require("./routes/support.routes");
const adminRoutes = require("./routes/admin.routes");
const facultyRoutes = require("./routes/faculty.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const uploadRoutes = require("./routes/upload.routes");
const profileRoutes = require("./routes/profile.routes");
const passwordRoutes = require("./routes/password.routes");
const lessonRoutes = require("./routes/lessonRoutes");
const app = express();
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : [])
        : "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

const paymentRoutes = require("./routes/payment.routes");
app.use("/api/payment", paymentRoutes);

const enrollmentRoutes = require("./routes/enrollment.routes");
app.use("/api/enrollments", enrollmentRoutes);

app.use("/api/config", configRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/lessons", lessonRoutes);
const net = require("net");

app.get("/api/test-smtp", (req, res) => {
  const socket = net.createConnection(587, "smtp-relay.brevo.com");

  socket.setTimeout(10000);

  socket.on("connect", () => {
    socket.end();
    res.send("SMTP Port Reachable ✅");
  });

  socket.on("timeout", () => {
    socket.destroy();
    res.status(500).send("SMTP Timeout ❌");
  });

  socket.on("error", (err) => {
    res.status(500).send(err.message);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));












