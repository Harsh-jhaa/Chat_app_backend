import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized access - no token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded || !decoded.userId) {
      return res
        .status(401)
        .json({ message: 'Unauthorized access - invalid token' });
    }

    // Fetch user from database based on decoded userId and exclude password
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized access - user not found' });
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error in protected route middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default protectedRoute;
