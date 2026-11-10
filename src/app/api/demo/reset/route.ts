import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST() {
  try {
    const db = getDb();
    const prevOrdersCount = db.orders?.length || 0;
    const prevPayoutsCount = db.payouts?.length || 0;

    // Reset orders and payouts for fresh demo recording
    db.orders = [];
    db.payouts = [];
    saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'Demo account data successfully cleared. Locker is now fresh and empty for demo recording.',
      clearedOrders: prevOrdersCount,
      clearedPayouts: prevPayoutsCount,
      activeProductsCount: db.products?.length || 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reset demo data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
