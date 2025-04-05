// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { User } from '../schema/userSchema.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Auth token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // attaching user to req
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

export const isCoordinator = (req, res, next) => {
if (req.user?.role === 'club_coordinator') next();
else res.status(403).json({ message: 'Coordinator only' });
};
  