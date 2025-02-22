const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');

router.get('/popular', movieController.getPopularMovies);
router.get('/:id', movieController.getMovieDetails);
router.get('/search', movieController.searchMovies);

module.exports = router;
