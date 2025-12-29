import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
    voterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true,
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to ensure a user can only vote once per election
VoteSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema);
