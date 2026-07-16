const express = require('express');
const router = express.Router();
const tmdbController = require('../controllers/tmdb.controller');
const { protect } = require('../middleware/auth');

// Require authentication for all TMDb routes
router.use(protect);

router.get('/trending', tmdbController.getTrending);
router.get('/popular', tmdbController.getPopular);
router.get('/top-rated', tmdbController.getTopRated);
router.get('/upcoming', tmdbController.getUpcoming);
router.get('/search', tmdbController.search);
router.get('/movie/:id', tmdbController.getMovie);

module.exports = router;
