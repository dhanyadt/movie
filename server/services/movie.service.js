const UserMovie = require('../models/UserMovie');

/**
 * Save a movie to the user's library
 */
const addMovieToLibrary = async (userId, movieData) => {
  const { tmdbId, status, favorite, collection } = movieData;

  if (tmdbId === undefined || !status) {
    const error = new Error('Please provide both tmdbId and status');
    error.statusCode = 400;
    throw error;
  }

  try {
    const userMovie = await UserMovie.create({
      userId,
      tmdbId,
      status,
      favorite: favorite || false,
      collection: collection || '',
    });
    return userMovie;
  } catch (error) {
    if (error.code === 11000) {
      const dbError = new Error('This movie is already in your library');
      dbError.statusCode = 409; // Conflict
      throw dbError;
    }
    throw error;
  }
};

/**
 * Return movies belonging strictly to the user with optional filters, pagination, and sorting
 */
const getUserLibrary = async (userId, filters, options = {}) => {
  const query = { userId };

  // Apply filters
  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.favorite !== undefined) {
    query.favorite = filters.favorite === 'true' || filters.favorite === true;
  }

  if (filters.collection) {
    query.collection = filters.collection;
  }

  // Pagination & Sorting options
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const sort = options.sort || '-createdAt';

  // Perform count and paginated query
  const total = await UserMovie.countDocuments(query);
  const data = await UserMovie.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const pages = Math.ceil(total / limit) || 1;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
};

/**
 * Return one saved movie belonging to the authenticated user
 */
const getUserMovie = async (userId, tmdbId) => {
  const userMovie = await UserMovie.findOne({ userId, tmdbId: Number(tmdbId) });
  if (!userMovie) {
    const error = new Error('Movie not found in your library');
    error.statusCode = 404;
    throw error;
  }
  return userMovie;
};

/**
 * Update movie details in user's library
 */
const updateUserMovie = async (userId, tmdbId, updateData) => {
  const userMovie = await UserMovie.findOne({ userId, tmdbId: Number(tmdbId) });
  if (!userMovie) {
    const error = new Error('Movie not found in your library');
    error.statusCode = 404;
    throw error;
  }

  // Allowed fields to update
  const allowedUpdates = ['status', 'rating', 'review', 'favorite', 'collection', 'watchedDate'];
  
  allowedUpdates.forEach((field) => {
    if (updateData[field] !== undefined) {
      userMovie[field] = updateData[field];
    }
  });

  // Run mongoose validation
  await userMovie.save();
  return userMovie;
};

/**
 * Delete a movie from user's library
 */
const deleteUserMovie = async (userId, tmdbId) => {
  const userMovie = await UserMovie.findOneAndDelete({ userId, tmdbId: Number(tmdbId) });
  if (!userMovie) {
    const error = new Error('Movie not found in your library');
    error.statusCode = 404;
    throw error;
  }
  return userMovie;
};

/**
 * Get movie library statistics for a user
 */
const getLibraryStats = async (userId) => {
  const [totalMovies, watchingCount, watchedCount, planToWatchCount] = await Promise.all([
    UserMovie.countDocuments({ userId }),
    UserMovie.countDocuments({ userId, status: 'Watching' }),
    UserMovie.countDocuments({ userId, status: 'Watched' }),
    UserMovie.countDocuments({ userId, status: 'Plan to Watch' }),
  ]);

  return {
    totalMovies,
    watchingCount,
    watchedCount,
    planToWatchCount,
  };
};

module.exports = {
  addMovieToLibrary,
  getUserLibrary,
  getUserMovie,
  updateUserMovie,
  deleteUserMovie,
  getLibraryStats,
};
