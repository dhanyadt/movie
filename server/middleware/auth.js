const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        res.status(500);
        return next(new Error('JWT_SECRET configuration is missing on the server.'));
      }

      const decoded = jwt.verify(token, secret);

      // Get user from the token, omitting the password field
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        favoriteGenres: user.favoriteGenres,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed or expired'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

module.exports = { protect };
