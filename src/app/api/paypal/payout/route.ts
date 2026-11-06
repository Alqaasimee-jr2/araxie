import { NextRequest, NextResponse } from 'next/server';
import { executeCreatorPayout } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, creatorEmail, creatorName, amount } = body;

    if (!creatorEmail || !amount) {
      return NextResponse.json({ error: 'creatorEmail and amount are required' }, { status: 400 });
    }

    const result = await executeCreatorPayout({
      orderId: orderId || `manual-${Date.now()}`,
      creatorEmail,
      creatorName: creatorName || 'Student Builder',
      amount: Number(amount),
    });

    return NextResponse.json({
      success: result.success,
      batchId: result.batchId,
      grossAmount: amount,
      platformFee: result.feeDeducted,
      netPayout: Number((amount - result.feeDeducted).toFixed(2)),
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Payout processing failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
