import jwt from 'jsonwebtoken';
import usermodel from '../models/user.model.js'; // ← add `.js` if it's an ES module

export const authuser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Token not found' }); // fixed typo: "massage" → "message"
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    const user = await usermodel.findById(decode._id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - User not found' });
    }

    req.user = user;
    console.log(req.user);
    next();

  } catch (error) {
    console.error('Auth error:', error); // Optional: log the actual error
    return res.status(500).json({ message: 'Authentication error' }); // fixed typo again
  }
};