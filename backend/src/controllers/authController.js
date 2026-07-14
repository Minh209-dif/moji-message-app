import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '30m'; // 30 minutes time to live for access token
const REFRESH_TOKEN_TTL = 14*24*60*60*1000; // 14 days in milliseconds

export const signUp = async (req, res) => {
   
    try {
        const { username, password, email, firstName, lastName } = req.body;
        
        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields are required (username, password, email, first name, and last name)' });
        }

        // Check if the username or email already exists in the database
        const duplicate = await User.findOne({ username });
        if (duplicate) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds, which determines the complexity of the hashing

        // Create a new user in the database
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        });

        res.sendStatus(204); 
    } catch (error) {
        console.error('Error occurred while signing up:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const signIn = async (req, res) => {
    try {
        // Take input from the user
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // take hashedPassword from the database to compart with the password provided by the user
        const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // if the password is correct, create accessToken with JWT
        const accessToken = jwt.sign(
            { userId: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        // create refreshToken with JWT
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // Store the refresh token in the database with an expiration date
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        // return refresh token through cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Set to true if using HTTPS
            sameSite: 'none', 
            maxAge: REFRESH_TOKEN_TTL
        });

        // return access token through response body
        return res.status(200).json({ message: `User ${user.displayName} signed in successfully`, accessToken });
    } catch (error) {
        console.error('Error occurred while signing in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const signOut = async (req, res) => {
    try {
        // Get the refresh token from the cookie
        const token = req.cookies?.refreshToken;
        if (token) {
            // Remove the refresh token from the database
            await Session.deleteOne({ refreshToken: token });

            // Clear the refresh token cookie
            res.clearCookie('refreshToken');
        }

        return res.sendStatus(204); // No Content
    } catch (error) {
        console.error('Error occurred while signing out:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Create new access token from refresh token
export const refreshToken = async (req,res) => {
    try {
        // get refresh token from cookie
        const token = req.cookie?.refreshToken;
        if (!token){
            return res.status(401).json({ message: 'Token not found' });
        }

        // compare with refresh token in db
        const session = await Session.findOne({ refreshToken: token });
        if (!session){
            return res.status(403).json({ message: 'Invalid token' })
        }

        // check the expire date
        if (session.expiresAt < new Date()){
            return res.status(403).json({ message: 'Invalid token' })
        }

        // create a new access token
        const accessToken = jwt.sign(
            { userId: session.userId },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: ACCESS_TOKEN_TTL}
        );
        // return
    } catch (error) {
        console.error('Error when calling refreshToken', error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}