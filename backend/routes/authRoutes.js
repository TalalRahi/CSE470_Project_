const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/change-password', protect, changePassword);

module.exports = router;