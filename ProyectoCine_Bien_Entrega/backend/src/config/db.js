const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/videoclub', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado correctamente');

    // Crear índices aquí si es necesario
    const Review = require('../models/Review');
    await Review.collection.createIndex({ user: 1, movie: 1 });
    console.log('Índices creados correctamente');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;