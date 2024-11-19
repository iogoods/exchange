const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

// Initialisieren der App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB-Verbindung
const MONGO_URI = 'mongodb://localhost:27017/user'; // Lokale MongoDB-URL
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routen
app.use('/api/auth', authRoutes); // Authentifizierung und Benutzerverwaltung
app.use('/api/orders', orderRoutes); // Order-Management

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Crypto Exchange Backend is running.');
});

// Server starten
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
