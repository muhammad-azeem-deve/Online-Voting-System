import dbConnect from '@/lib/dbConnect';
import Election from '@/models/Election';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export async function GET() {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify token validity
        try { jwt.verify(token, JWT_SECRET); }
        catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

        // Return active and completed elections? Or just active? 
        // "voters can select election, view results". Results might be for ended elections.
        // So return all non-upcoming? Or all?
        // Let's return all but status filtered in frontend or sorted.
        // Actually, voter usually only sees Active for voting, Ended for results.
        const elections = await Election.find({ status: { $in: ['active', 'ended'] } }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, elections });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
