const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie.routes');
const tmdbRoutes = require('./routes/tmdb.routes');
const errorHandler = require('./middleware/error');

const app = express();

// Request logging middleware
app.use(morgan('dev'));

// CORS configuration
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// GET /api/health endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tmdb', tmdbRoutes);

// Catch 404 (optional)
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
