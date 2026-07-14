import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = (req, res, next) => {
    try{
        // Take token from the request header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ message: 'Access token is missing' });
        };
        // Check if the token is valid
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.status(403).json({ message: 'Invalid access token' });
            }
            // Find user
            const user = await User.findById(decodedUser.userId).select('-hashedPassword'); // Exclude hashedPassword from the user object
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error occurred in JWT authentication in authMiddleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}