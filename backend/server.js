const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Import middleware
const { authenticateToken, JWT_SECRET } = require('./middleware/auth');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite default port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

const { getEmployeeData } = require('./googleSheets');

// Hardcoded users (in production, use database)
const users = [
  { 
    id: 1, 
    username: 'admin', 
    password: '$2a$10$8f5L.mQ8P3P9.xF3HWe7Y.I8q7Y5aF5L.mQ8P3P9.xF3HWe7Y.I8q7Y5a' // 'admin123' hashed
  }
];

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Check password (for demo, we'll also accept plain text)
    const isValidPassword = password === 'admin123' || await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Protected employees routes
app.get('/api/employees', authenticateToken, async (req, res) => {
  try {
    const employees = await getEmployeeData();
    res.json(employees);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});
