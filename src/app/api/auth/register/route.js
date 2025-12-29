import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await dbConnect();
        const { username, password, fullName, role } = await request.json();

        if (!username || !password || !fullName) {
            return NextResponse.json(
                { error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword,
            fullName,
            role: role || 'voter',
        });

        return NextResponse.json(
            { message: 'User registered successfully', success: true },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
