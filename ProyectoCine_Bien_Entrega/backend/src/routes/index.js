const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const movieController = require('../controllers/movieController');
const userController = require('../controllers/userController');

// Rutas de autenticación
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// Rutas de películas (públicas)
router.get('/movies/popular', movieController.getPopularMovies);
router.get('/movies/:id', movieController.getMovieDetails);
router.get('/movies/:id/reviews', movieController.getMovieReviews);

// Rutas de usuario (protegidas)
router.get('/user/me', protect, userController.getUserProfile);
router.post('/user/favorites', protect, userController.toggleFavorite);
router.get('/user/favorites', protect, userController.getUserFavorites);
router.post('/user/reviews', protect, userController.addReview);
router.get('/user/reviews', protect, userController.getUserReviews);

module.exports = router;