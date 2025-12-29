import dbConnect from '@/lib/dbConnect';
import Vote from '@/models/Vote';
import Election from '@/models/Election';
import User from '@/models/User'; // Ensure User model is loaded
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export async function POST(request) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        let userId;
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.id;
        } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

        const { electionId, candidateId } = await request.json();

        // 1. Check if election is active
        const election = await Election.findById(electionId);
        if (!election) return NextResponse.json({ error: 'Election not found' }, { status: 404 });
        if (election.status !== 'active') return NextResponse.json({ error: 'Election is not active' }, { status: 400 });

        // 2. Check if user already voted in this election
        const existingVote = await Vote.findOne({ voterId: userId, electionId });
        if (existingVote) {
            return NextResponse.json({ error: 'You have already voted in this election' }, { status: 400 });
        }

        // 3. Create Vote
        await Vote.create({
            voterId: userId,
            electionId,
            candidateId
        });

        // 4. Update Election Candidate Count
        const candidateIndex = election.candidates.findIndex(c => c._id.toString() === candidateId);
        if (candidateIndex !== -1) {
            election.candidates[candidateIndex].voteCount += 1;
            await election.save();
        }

        // 5. Update User hasVoted flag (optional, but requested for generic "voter can vote only once time" -> actually usually means once per election)
        // The prompt says "voter can vote only for once time". If it means GLOBALLY once, I should check user.hasVoted.
        // If it means "once per election", the Vote model check handles it.
        // The prompt: "one voter can only vote to one candidate and voter can vote only for once time, if voter try to vote twice show alert..."
        // Usually means one vote per election. BUT "voter can vote only for once time" might be interpreted as once EVER.
        // I will assume "Once per Election" is the sensible interpretation, but I'll add logic to support the "Global" if strictly needed.
        // However, "select election" implies multiple elections. So "once per election" is the only logical one.

        return NextResponse.json({ success: true, message: 'Vote cast successfully' });

    } catch (error) {
        if (error.code === 11000) { // Duplicate key error from MongoDB index
            return NextResponse.json({ error: 'You have already voted' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
