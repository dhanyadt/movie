const tmdbService = require('../services/tmdb.service');

const getTrending = async (req, res, next) => {
  try {
    const result = await tmdbService.getTrendingWeekly();
    res.status(200).json({
      success: true,
      data: result.results,
    });
  } catch (error) {
    next(error);
  }
};

const getPopular = async (req, res, next) => {
  try {
    const result = await tmdbService.getPopular();
    res.status(200).json({
      success: true,
      data: result.results,
    });
  } catch (error) {
    next(error);
  }
};

const getTopRated = async (req, res, next) => {
  try {
    const result = await tmdbService.getTopRated();
    res.status(200).json({
      success: true,
      data: result.results,
    });
  } catch (error) {
    next(error);
  }
};

const getUpcoming = async (req, res, next) => {
  try {
    const result = await tmdbService.getUpcoming();
    res.status(200).json({
      success: true,
      data: result.results,
    });
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const query = req.query.q;
    const result = await tmdbService.searchMovies(query);
    res.status(200).json({
      success: true,
      data: result.results,
    });
  } catch (error) {
    next(error);
  }
};

const getMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await tmdbService.getMovieDetails(id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  search,
  getMovie,
};
