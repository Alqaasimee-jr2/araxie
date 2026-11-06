import { NextRequest, NextResponse } from 'next/server';
import { registerStudent } from '@/lib/auth';
import { sanitizeInput, validateEmail, checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';

    // Anti-bot / account spam protection: max 4 registrations per 5 minutes per IP
    const rateCheck = checkRateLimit(`auth:register:${clientIp}`, 4, 300000);
    if (rateCheck.limited) {
      return NextResponse.json(
        { error: 'Registration rate limit exceeded. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawName = body.name;
    const rawEmail = body.email;
    const rawPassword = body.password;
    const rawUni = body.university;
    const rawRole = body.role;

    if (!rawEmail || !rawPassword || !rawName) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const name = sanitizeInput(rawName, 70);
    const email = sanitizeInput(rawEmail, 150);
    const password = String(rawPassword).substring(0, 100);
    const university = sanitizeInput(rawUni || 'University Campus', 100);
    const role = rawRole === 'student_creator' ? 'student_creator' : 'student_buyer';

    if (name.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters long' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid university email format' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const result = await registerStudent({
      name,
      email,
      password,
      university,
      role,
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
      sameSite: 'lax',
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
