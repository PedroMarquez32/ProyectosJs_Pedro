const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getUserProfile, 
  getUserFavorites, 
  getUserReviews,
  deleteReview 
} = require('../controllers/userController');

router.use(protect);
router.get('/profile', getUserProfile);
router.get('/favorites', getUserFavorites);
router.get('/reviews', getUserReviews);
router.delete('/reviews/:reviewId', deleteReview);

module.exports = router;
