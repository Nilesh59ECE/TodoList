const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

// Load environment variables from .env file
require('dotenv').config();

// Define Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000/home');
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error occurred during logout' });
    }
    res.redirect('http://localhost:3000/login');
  });
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, birthday, address, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, birthday, address, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

router.get('/tasks', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('tasks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ tasks: user.tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/tasks', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ message: 'Task content is required' });
    }

    const newTask = { task };
    user.tasks.push(newTask);
    await user.save();
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/tasks/:taskId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const task = user.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.task = req.body.task;
    await user.save();
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/tasks/:taskId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.tasks = user.tasks.filter(task => task._id.toString() !== req.params.taskId);
    await user.save();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
