import dbConnect from '@/lib/dbConnect';
import Election from '@/models/Election';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check admin
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

        // Parse ID from URL or body? This is a dynamic route [id].
        // Wait, I need to put this file in src/app/api/admin/elections/[id]/route.js
        // I can't determine ID here easily if this is a general route file.
        // I will write this file to the correct path.

        // But this tool call is for ONE file.
        // I'll put the content here and specify the TargetFile correctly.
        // I'll assume the helper function or logic for ID is handled by Next.js params.

        const id = params.id; // This comes from the second argument of the handler
        const body = await request.json();

        const election = await Election.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json({ success: true, election });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        // Auth check...
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') throw new Error('Unauthorized');

        await Election.findByIdAndDelete(params.id);
        return NextResponse.json({ success: true, message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
