const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

// In-Memory Fallback User Store when MongoDB is disconnected
const inMemoryUsers = [];

const generateToken = (id, name, email) => {
  return jwt.sign({ id, name, email }, JWT_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (getIsConnected()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      });

      const token = generateToken(user._id, user.name, user.email);
      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } else {
      // Offline / In-Memory Fallback Mode
      const existing = inMemoryUsers.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date()
      };
      inMemoryUsers.push(newUser);

      const token = generateToken(newUser.id, newUser.name, newUser.email);
      return res.status(201).json({
        message: 'Registration successful (Offline Mode)',
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user._id, user.name, user.email);
      return res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } else {
      // Offline / In-Memory Fallback Mode
      const user = inMemoryUsers.find(u => u.email === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user.id, user.name, user.email);
      return res.json({
        message: 'Login successful (Offline Mode)',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    return res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};
