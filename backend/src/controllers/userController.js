import User from "../models/User.js";
import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";

export const authMe = async (req, res) => {
    try {
        const user = req.user;
        console.log('authMe called with user:', req.user);
        return res.status(200).json({user});
    } catch (error) {
        console.error('Error occurred while fetching user info:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const searchUserByUsername = async (req, res) => {
    try {
        const {username} = req.query;

        if(!username || username.trim() === "") {
            return res.status(400).json({message: "Need to provide username in query: "});
        }

        const user = await User.findOne({username}).select("_id displayName username avatarUrl");
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error searching for user by username: ", error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const uploadAvatar = async (req, res) => {
    try{
        const file = req.file;
        const userId = req.user._id;

        if(!file) {
            return res.status(400).json({message: "No file uploaded"});
        }

        const result = await uploadImageFromBuffer(file.buffer);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                avatarUrl: result.secure_url,
                avatarId: result.public_id
            }, {new: true}
        ).select("avatarUrl");

        if(!updatedUser.avatarUrl) {
            return res.status(400).json({message: "Avatar returned null"});
        }

        return res.status(200).json({avatarUrl: updatedUser.avatarUrl});
    } catch (error) {
        console.error("Error uploading avatar: ", error);
        return res.status(500).json({message: "Avatar upload failed"});
    }
}