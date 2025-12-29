import dbConnect from '@/lib/dbConnect';
import Election from '@/models/Election';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

async function isAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return false;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.role === 'admin';
    } catch (e) {
        return false;
    }
}

export async function GET() {
    try {
        await dbConnect();
        if (!await isAdmin()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const elections = await Election.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, elections });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        if (!await isAdmin()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const body = await request.json();
        const election = await Election.create(body);
        return NextResponse.json({ success: true, election }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
