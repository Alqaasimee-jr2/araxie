import { NextRequest, NextResponse } from 'next/server';
import { registerStudent } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, university, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const result = await registerStudent({
      name,
      email,
      password,
      university: university || 'Verified University',
      role: role || 'student_buyer',
    });

    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error || 'Registration failed' }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    response.cookies.set('araxie_session', JSON.stringify(result.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
