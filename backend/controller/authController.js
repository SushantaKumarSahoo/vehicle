const User = require('../models/user.models');
const Admin = require('../models/admin.models'); 
// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ message: 'Login successful', user });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error during login');
  }
};
//user Signup
const signupUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  const newUser = new User({ fullName, email, password });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('Error creating user');
  }
};

// Admin login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email, password });
    if (admin) {
      res.json({ message: 'Login successful', admin });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).send('Error during login');
  }
};

// Admin signup
const signupAdmin = async (req, res) => {
  const { fullName, email, password } = req.body;
  const newAdmin = new Admin({ fullName, email, password });

  try {
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).send('Error creating admin');
  }
};

module.exports = {
  loginUser,
  signupUser,
  adminLogin,
  signupAdmin,
};

