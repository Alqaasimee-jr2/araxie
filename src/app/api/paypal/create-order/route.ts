import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { computeVerifiedCartTotal } from '@/lib/pricing';
import { getAllProducts } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, productIds, customId } = body;

    // 1. Resolve product IDs for server-side verification
    let resolvedIds: string[] = [];

    if (Array.isArray(productIds) && productIds.length > 0) {
      resolvedIds = productIds;
    } else if (Array.isArray(items) && items.length > 0) {
      // Map item IDs or find by title in official catalog
      const catalog = getAllProducts();
      resolvedIds = items
        .map((i: { id?: string; name?: string }) => {
          if (i.id) return i.id;
          const match = catalog.find(c => c.title.toLowerCase() === (i.name || '').toLowerCase());
          return match?.id;
        })
        .filter((id): id is string => Boolean(id));
    }

    if (resolvedIds.length === 0) {
      return NextResponse.json({ error: 'No valid catalog products specified' }, { status: 400 });
    }

    // 2. Server-side price integrity: Recompute total from verified catalog and discount formula
    const calculation = computeVerifiedCartTotal(resolvedIds);

    if (calculation.verifiedProducts.length === 0) {
      return NextResponse.json({ error: 'No catalog products found matching requested IDs' }, { status: 400 });
    }

    // 3. Create PayPal Order using the server-verified total
    const result = await createPayPalOrder({
      items: calculation.itemShares.map(item => ({
        name: item.title,
        unitAmount: item.discountedPrice,
        quantity: 1,
        description: `Verified Student Software License (${calculation.discountPercentage}% Bundle Savings)`,
      })),
      totalAmount: calculation.finalTotal,
      currency: 'USD',
      customId: customId || `cart-${resolvedIds.join('_').slice(0, 50)}`,
    });

    return NextResponse.json({
      orderId: result.id,
      simulated: result.simulated,
      totalAmount: calculation.finalTotal,
      originalTotal: calculation.originalTotal,
      discountPercentage: calculation.discountPercentage,
      savings: calculation.savings,
      verifiedProductsCount: calculation.verifiedProducts.length,
      currency: 'USD',
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
