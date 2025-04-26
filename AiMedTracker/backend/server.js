// server.js - Express backend for MedTracker
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory store for users (replace with DB in production)
const users = [];

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, userType, createdAt } = req.body;
    // Check if user already exists
    if (users.find(u => u.email === email && u.userType === userType)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user record
    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      userType,
      createdAt,
    };
    users.push(newUser);
    return res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error in /api/register:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    // Find user
    const user = users.find(u => u.email === email && u.userType === userType);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    // Exclude password in response
    const { password: pwd, ...userSafe } = user;
    return res.json({ user: userSafe });
  } catch (err) {
    console.error('Error in /api/login:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
