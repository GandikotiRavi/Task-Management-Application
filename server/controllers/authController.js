const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isUsingMongo, readStore, writeStore, initStore } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Generate JWT Helper
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isUsingMongo()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      // Fallback JSON Store
      const store = (await initStore()) || { users: [], tasks: [] };
      const existingUser = store.users.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'user_' + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      store.users.push(newUser);
      writeStore(store);

      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully!',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isUsingMongo()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      // Fallback JSON Store
      const store = (await initStore()) || { users: [], tasks: [] };
      const user = store.users.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
};

// Demo Login (Instant access)
exports.demoLogin = async (req, res) => {
  try {
    if (isUsingMongo()) {
      let demoUser = await User.findOne({ email: 'demo@example.com' });
      if (!demoUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        demoUser = await User.create({
          name: 'Alex Johnson (Demo)',
          email: 'demo@example.com',
          password: hashedPassword
        });
      }
      const token = generateToken(demoUser);
      return res.status(200).json({
        success: true,
        message: 'Welcome to the Demo Account!',
        token,
        user: {
          id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email
        }
      });
    } else {
      const store = await initStore();
      const demoUser = store.users.find((u) => u.email === 'demo@example.com') || store.users[0];
      const token = generateToken(demoUser);
      return res.status(200).json({
        success: true,
        message: 'Welcome to the Demo Account!',
        token,
        user: {
          id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email
        }
      });
    }
  } catch (err) {
    console.error('Demo login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during demo login.'
    });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isUsingMongo()) {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      const store = readStore() || { users: [] };
      const user = store.users.find((u) => u._id === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
