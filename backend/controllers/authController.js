const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Benutzer aus der Datenbank abrufen
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Passwort prüfen
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Token erstellen
    const token = jwt.sign({ id: user._id }, 'mySecretKey', { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
