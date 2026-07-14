const mongoose = require('mongoose');

const UserMovieSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    tmdbId: {
      type: Number,
      required: [true, 'TMDb Movie ID is required'],
    },
    status: {
      type: String,
      required: [true, 'Watch status is required'],
      enum: {
        values: ['Plan to Watch', 'Watching', 'Watched'],
        message: '{VALUE} is not a valid status (Plan to Watch, Watching, Watched)',
      },
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    review: {
      type: String,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    collection: {
      type: String,
      trim: true,
    },
    watchedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

// Compound index to prevent a user from saving the same movie twice
UserMovieSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('UserMovie', UserMovieSchema);
