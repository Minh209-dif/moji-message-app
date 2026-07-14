import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String // Field for storing the URL of the user's avatar image
    },
    avatarId: {
        type: String // Cloudinary public ID for the user's avatar image, used for image management and retrieval
    },
    bio: {
        type: String,
        maxlength: 500
    },
    phone:{
        type: String,
        sparse: true // Allows for unique values but permits null or undefined entries
    }
    }, 
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields to the schema
    }
);

const User = mongoose.model('User', userSchema);
export default User;