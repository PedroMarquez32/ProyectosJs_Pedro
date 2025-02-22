require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const routes = require('./routes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const Review = require('./models/Review');
const movieRoutes = require('./routes/movieRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true
}));

// Rutas
app.use('/api', routes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/favorites', favoriteRoutes);
app.use('/api/user', userRoutes);
app.use('/api/movies', movieRoutes);

// Conectar a MongoDB (solo una vez)
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;