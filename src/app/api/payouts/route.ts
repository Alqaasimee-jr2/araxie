import { NextRequest, NextResponse } from 'next/server';
import { getAllPayouts } from '@/lib/db';

export async function GET() {
  try {
    const payouts = getAllPayouts();
    return NextResponse.json({ payouts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch payouts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
