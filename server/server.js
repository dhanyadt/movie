const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database if MONGODB_URI is provided
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.warn('WARNING: MONGODB_URI is not set in environment variables. Database connection skipped.');
}

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
