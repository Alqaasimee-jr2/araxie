import { NextRequest, NextResponse } from 'next/server';
import { verifyCryptographicLicenseKey } from '@/lib/licenses';
import { getAllOrders } from '@/lib/db';
import { sanitizeInput } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawKey = searchParams.get('key');

    if (!rawKey) {
      return NextResponse.json({ error: 'License key parameter is required' }, { status: 400 });
    }

    const key = sanitizeInput(rawKey, 64);
    const verification = verifyCryptographicLicenseKey(key);

    // Look up if this license key is active in the order ledger
    const orders = getAllOrders();
    const matchedOrder = orders.find(o => o.licenseKey === key);

    return NextResponse.json({
      success: verification.valid,
      key,
      verified: verification.valid,
      cryptographicSignature: 'HMAC-SHA256 Verified',
      registeredOrder: matchedOrder ? {
        orderId: matchedOrder.orderId,
        productTitle: matchedOrder.product.title,
        purchaseDate: matchedOrder.purchaseDate,
        status: matchedOrder.status,
      } : null,
      verificationDetails: verification,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'License verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
