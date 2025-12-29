import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    party: { type: String, required: true },
    symbol: { type: String }, // Optional URL or emoji
    voteCount: { type: Number, default: 0 },
});

const ElectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide election title'],
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'ended'],
        default: 'upcoming',
    },
    candidates: [CandidateSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Election || mongoose.model('Election', ElectionSchema);
