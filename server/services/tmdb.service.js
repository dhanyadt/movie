/**
 * Helper to fetch data from the TMDb API
 */
const fetchFromTMDb = async (endpoint, params = {}) => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    const error = new Error('TMDb integration is not configured. Missing TMDB_API_KEY.');
    error.statusCode = 500;
    throw error;
  }

  const queryParams = new URLSearchParams({
    api_key: apiKey,
    ...params,
  });

  const url = `https://api.themoviedb.org/3${endpoint}?${queryParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.status_message || `TMDb API error (${response.status})`);
      error.statusCode = response.status === 401 || response.status === 404 ? response.status : 502;
      throw error;
    }
    return await response.json();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 502; // Bad Gateway if network request fails
      error.message = 'Unable to connect to TMDb service: ' + error.message;
    }
    throw error;
  }
};

/**
 * Get weekly trending movies
 */
const getTrendingWeekly = async () => {
  return await fetchFromTMDb('/trending/movie/week');
};

/**
 * Get popular movies
 */
const getPopular = async () => {
  return await fetchFromTMDb('/movie/popular');
};

/**
 * Get top rated movies
 */
const getTopRated = async () => {
  return await fetchFromTMDb('/movie/top_rated');
};

/**
 * Get upcoming movies
 */
const getUpcoming = async () => {
  return await fetchFromTMDb('/movie/upcoming');
};

/**
 * Search movies by query string
 */
const searchMovies = async (query) => {
  if (!query || !query.trim()) {
    const error = new Error('Search query is required');
    error.statusCode = 400;
    throw error;
  }
  return await fetchFromTMDb('/search/movie', { query });
};

/**
 * Get full details of a specific movie
 */
const getMovieDetails = async (id) => {
  if (!id) {
    const error = new Error('Movie ID is required');
    error.statusCode = 400;
    throw error;
  }
  return await fetchFromTMDb(`/movie/${id}`);
};

module.exports = {
  getTrendingWeekly,
  getPopular,
  getTopRated,
  getUpcoming,
  searchMovies,
  getMovieDetails,
};
