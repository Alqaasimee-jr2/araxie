import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder, executeCreatorPayout } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, products, buyerEmail } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // 1. Capture the payment on PayPal
    const captureResult = await capturePayPalOrder(orderId);

    // 2. Generate license keys and unlock assets for each product
    const unlockedItems = (products || []).map((prod: { id: string; title: string; downloadAsset?: { licenseKeyPrefix?: string; url?: string }; creator?: { name?: string; payoutEmail?: string }; price?: number }) => {
      const prefix = prod.downloadAsset?.licenseKeyPrefix || 'ARX';
      const randomSeg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randomSeg2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const licenseKey = `${prefix}-${randomSeg1}-${randomSeg2}-2026`;

      return {
        productId: prod.id,
        title: prod.title,
        licenseKey,
        downloadUrl: prod.downloadAsset?.url || 'https://araxie.dev/assets/download',
        status: 'active',
      };
    });

    // 3. Trigger creator payouts for each product sold
    const payoutReceipts = [];
    for (const prod of (products || [])) {
      if (prod.creator?.payoutEmail && prod.price) {
        const payout = await executeCreatorPayout({
          orderId,
          creatorEmail: prod.creator.payoutEmail,
          creatorName: prod.creator.name || 'Student Creator',
          amount: prod.price,
        });
        payoutReceipts.push({
          creatorEmail: prod.creator.payoutEmail,
          creatorName: prod.creator.name,
          grossAmount: prod.price,
          feeDeducted: payout.feeDeducted,
          netPayout: Number((prod.price - payout.feeDeducted).toFixed(2)),
          batchId: payout.batchId,
        });
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      captureId: captureResult.captureId,
      status: captureResult.status,
      payer: captureResult.payer || { emailAddress: buyerEmail || 'student@university.edu' },
      unlockedItems,
      payoutReceipts,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to capture order';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
