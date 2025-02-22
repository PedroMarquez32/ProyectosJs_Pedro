const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getFavorites, 
  addFavorite, 
  removeFavorite 
} = require('../controllers/favoriteController');

router.use(protect); // Todas las rutas de favoritos requieren autenticación

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:movieId', removeFavorite);

module.exports = router; 