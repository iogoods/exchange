const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const MONGO_URI = 'mongodb://202.61.243.84:27017/user';
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Aktiviert CORS für alle Domains

// MongoDB-Verbindung
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Authentifizierungsrouten
app.use('/api/auth', authRoutes);

// Geschützte Route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.send(`Welcome! Your user ID is ${req.user.id}`);
});

// Standardroute
app.get('/', (req, res) => {
  res.send('API is working and connected to MongoDB!');
});

// Server starten
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
