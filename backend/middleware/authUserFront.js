import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');

            // Get user from the token
            req.user = await userModel.findById(decoded.id).select('-password');

            // If no user found with this id
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, no user found' });
            }

            next();
        } else {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(401).json({ message: 'Not authorized as an admin' });
    }
};