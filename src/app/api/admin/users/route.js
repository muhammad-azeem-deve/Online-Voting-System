import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export async function GET() {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        // Simple verification
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

        const users = await User.find({ role: 'voter' }).select('-password').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
