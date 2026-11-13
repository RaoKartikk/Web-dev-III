const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const appEvents = require('../events/appEvents');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    appEvents.emit('user:registered', newUser);

    return res.status(201).json({
      message: 'User registered',
      id: newUser._id,
      username: newUser.username,
      email: newUser.email
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    appEvents.emit('user:loggedIn', user);

    return res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;