const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const walletRoutes = require('./routes/wallets');
const transactionRoutes = require('./routes/transactions');


const app = express();
const PORT = 5000;
const JWT_SECRET = 'secret_key_for_jwt'; // Ersetze durch einen sicheren Schlüssel


app.use(express.json());
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);


// Middleware
app.use(express.json());


// CORS-Konfiguration
app.use(cors({
  origin: '*', // Erlaubt alle Ursprünge
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Erlaubte Methoden
  allowedHeaders: ['Content-Type', 'Authorization'], // Erlaubte Header
  preflightContinue: false, // Beende Preflight-Anfragen
  optionsSuccessStatus: 204 // Status für erfolgreiche Preflight-Antworten
}));

s
// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/exchange', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 }, // Startguthaben
});

// User Model
const User = mongoose.model('User', userSchema);

// Routes

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ message: 'Error registering user' });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, balance: user.balance } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get User Info Endpoint
app.get('/api/auth/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ id: user._id, username: user.username, email: user.email, balance: user.balance });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Protected Endpoint Example
app.get('/api/protected', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ message: 'This is protected data' });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
