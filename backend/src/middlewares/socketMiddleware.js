import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if(!token){
            return next(new Error("Unauthorized - Token not exist"));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decoded){
            return next(new Error("Unauthorized - Invalid token"));
        }

        const user =  await User.findById(decoded.userId).select("-hashedPassword");
        if(!user){
            next(new Error("User not exit"));
        }

        socket.user = user;
        next();
    } catch (error) {
    console.error("Error verifying JWT in socketMiddleware", error);
        next(new Error("Unauthorized"));
    }
}