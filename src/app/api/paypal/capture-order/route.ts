import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder, executeCreatorPayout } from '@/lib/paypal';
import { addOrders, addPayout } from '@/lib/db';
import { PurchasedItem, Product } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, products, buyerEmail } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // 1. Capture payment on PayPal
    const captureResult = await capturePayPalOrder(orderId);

    // 2. Generate license keys and unlock assets
    const unlockedItems = (products || []).map((prod: Product) => {
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

    // 3. Format purchased items for persistent DB storage
    const dateFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newPurchasedItems: PurchasedItem[] = (products || []).map((prod: Product, idx: number) => ({
      id: `order-item-${Date.now()}-${idx}`,
      productId: prod.id,
      product: prod,
      purchaseDate: dateFormatted,
      orderId,
      captureId: captureResult.captureId,
      licenseKey: unlockedItems[idx]?.licenseKey || `ARX-LIVE-2026`,
      amountPaid: prod.price,
      status: 'active',
      downloadUrl: unlockedItems[idx]?.downloadUrl || prod.downloadAsset.url,
    }));

    // Save to persistent database
    addOrders(newPurchasedItems);

    // 4. Trigger creator payouts for each product
    const payoutReceipts = [];
    for (const prod of (products || [])) {
      if (prod.creator?.payoutEmail && prod.price) {
        const payout = await executeCreatorPayout({
          orderId,
          creatorEmail: prod.creator.payoutEmail,
          creatorName: prod.creator.name || 'Student Creator',
          amount: prod.price,
        });

        const payoutRecord = {
          id: `payout-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          orderId,
          creatorName: prod.creator.name,
          creatorEmail: prod.creator.payoutEmail,
          amount: prod.price,
          platformFee: payout.feeDeducted,
          timestamp: new Date().toISOString(),
          status: 'SUCCESS' as const,
        };
        addPayout(payoutRecord);

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
      purchasedItems: newPurchasedItems,
      payoutReceipts,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to capture order';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
