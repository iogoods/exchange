const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB-Verbindung
mongoose.connect('mongodb://localhost:27017/user', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));

// Routen
app.use('/api/auth', authRoutes);

// Server starten
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
