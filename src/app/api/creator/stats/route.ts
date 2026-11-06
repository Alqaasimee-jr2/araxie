import { NextRequest, NextResponse } from 'next/server';
import { getCreatorStats } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || 'creator.sandbox@araxie.edu';
    const stats = getCreatorStats(email);
    return NextResponse.json({ success: true, stats });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch creator stats';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
