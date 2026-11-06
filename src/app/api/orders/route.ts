import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/db';

export async function GET() {
  try {
    const orders = getAllOrders();
    return NextResponse.json({ orders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch orders';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
