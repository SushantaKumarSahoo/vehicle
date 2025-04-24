const express = require('express');
const router = express.Router();
const {
  loginUser,
  signupUser,
  adminLogin,
  signupAdmin
} = require('../controller/authController');

router.post('/api/login', loginUser);
router.post('/api/signup', signupUser);
router.post('/api/adlogin', adminLogin);
router.post('/api/adsignup', signupAdmin);

module.exports = router;
