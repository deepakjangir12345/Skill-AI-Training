const express = require("express");
const router = express.Router();

const {
  getDashboard,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ADMIN DASHBOARD
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  getDashboard
);

// GET ALL USERS
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

// UPDATE USER ROLE
router.put(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware("admin"),
  updateUserRole
);

// DELETE USER
router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteUser
);

module.exports = router;


