// backend/controllers/userController.js

exports.getProfile = (req, res) => {
  res.status(200).json({
    message: "User profile working",
    user: req.user || null
  });
};
