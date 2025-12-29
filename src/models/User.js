import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        enum: ['admin', 'voter'],
        default: 'voter',
    },
    hasVoted: {
        type: Boolean,
        default: false, // Simple flag, but for multiple elections we check Vote model
    },
    fullName: {
        type: String,
        required: [true, 'Please provide full name'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
