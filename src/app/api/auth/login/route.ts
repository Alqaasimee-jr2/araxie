import { NextRequest, NextResponse } from 'next/server';
import { authenticateStudent } from '@/lib/auth';
import { sanitizeInput, validateEmail, checkRateLimit } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';

    // Anti brute-force protection: max 6 attempts per minute per IP
    const rateCheck = checkRateLimit(`auth:login:${clientIp}`, 6, 60000);
    if (rateCheck.limited) {
      return NextResponse.json(
        { error: 'Too many authentication attempts. Please wait 60 seconds.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawEmail = body.email;
    const rawPassword = body.password;

    if (!rawEmail || !rawPassword) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const email = sanitizeInput(rawEmail, 150);
    const password = String(rawPassword).substring(0, 100);

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
    }

    const result = await authenticateStudent(email, password);

    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error || 'Authentication failed' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    // Set secure session cookie
    response.cookies.set('araxie_session', JSON.stringify(result.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
