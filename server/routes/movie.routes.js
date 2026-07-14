const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const { protect } = require('../middleware/auth');

// Protect all movie endpoints
router.use(protect);

router.route('/')
  .post(movieController.saveMovie)
  .get(movieController.getMovies);

router.route('/:tmdbId')
  .get(movieController.getMovie)
  .put(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;
