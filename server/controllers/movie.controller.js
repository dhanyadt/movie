const movieService = require('../services/movie.service');

/**
 * Save movie to user library
 */
const saveMovie = async (req, res, next) => {
  try {
    const userMovie = await movieService.addMovieToLibrary(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Movie saved to library successfully',
      data: userMovie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all user movies with filters, sorting, and pagination
 */
const getMovies = async (req, res, next) => {
  try {
    const { status, favorite, collection, page, limit, sort } = req.query;

    const filters = { status, favorite, collection };
    const options = { page, limit, sort };

    const result = await movieService.getUserLibrary(req.user.id, filters, options);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single movie details
 */
const getMovie = async (req, res, next) => {
  try {
    const { tmdbId } = req.params;
    const userMovie = await movieService.getUserMovie(req.user.id, tmdbId);
    res.status(200).json({
      success: true,
      data: userMovie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update movie details
 */
const updateMovie = async (req, res, next) => {
  try {
    const { tmdbId } = req.params;
    const updatedMovie = await movieService.updateUserMovie(req.user.id, tmdbId, req.body);
    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: updatedMovie,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove movie from library
 */
const deleteMovie = async (req, res, next) => {
  try {
    const { tmdbId } = req.params;
    await movieService.deleteUserMovie(req.user.id, tmdbId);
    res.status(200).json({
      success: true,
      message: 'Movie removed from library successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveMovie,
  getMovies,
  getMovie,
  updateMovie,
  deleteMovie,
};
