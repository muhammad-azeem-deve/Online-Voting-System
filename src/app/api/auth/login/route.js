import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export async function POST(request) {
    try {
        await dbConnect();
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Please provide all fields' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 400 }
            );
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
            path: '/',
        });

        return NextResponse.json(
            {
                message: 'Login successful',
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    fullName: user.fullName,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
