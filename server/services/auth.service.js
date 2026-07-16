const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT Token
 * @param {string} id 
 * @param {string} email 
 * @returns {string} token
 */
const generateToken = (id, email) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in the environment variables.');
  }
  return jwt.sign({ id, email }, secret, {
    expiresIn: '7d',
  });
};

/**
 * Register User Service
 */
const registerUser = async (userData) => {
  const { name, email, password, avatar, favoriteGenres } = userData;

  if (!name || !email || !password) {
    const error = new Error('Please provide all required fields: name, email, password');
    error.statusCode = 400;
    throw error;
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error('A user with this email address already exists');
    error.statusCode = 409;
    throw error;
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    avatar: avatar || '',
    favoriteGenres: favoriteGenres || [],
  });

  // Return user details without password
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    favoriteGenres: user.favoriteGenres,
    createdAt: user.createdAt,
  };
};

/**
 * Login User Service
 */
const loginUser = async (email, password) => {
  if (!email || !password) {
    const error = new Error('Please provide both email and password');
    error.statusCode = 400;
    throw error;
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate Token
  const token = generateToken(user._id, user.email);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      favoriteGenres: user.favoriteGenres,
    },
  };
};

const updateUserProfile = async (userId, updateData) => {
  const { name, email } = updateData;

  if (!name || !email) {
    const error = new Error('Please provide name and email');
    error.statusCode = 400;
    throw error;
  }

  // Check if email is already taken by another user
  const emailExists = await User.findOne({ email, _id: { $ne: userId } });
  if (emailExists) {
    const error = new Error('A user with this email address already exists');
    error.statusCode = 409;
    throw error;
  }

  // Find and update user
  const user = await User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    favoriteGenres: user.favoriteGenres,
  };
};

const updateUserPassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    const error = new Error('Please provide both current and new passwords');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  // Set new password (will be hashed automatically by pre('save') hook)
  user.password = newPassword;
  await user.save();

  return {
    success: true,
    message: 'Password updated successfully',
  };
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  generateToken,
  updateUserPassword,
};
