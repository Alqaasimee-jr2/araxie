import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, totalAmount, customId } = body;

    if (!items || !items.length || typeof totalAmount !== 'number') {
      return NextResponse.json({ error: 'Invalid order parameters' }, { status: 400 });
    }

    const result = await createPayPalOrder({
      items: items.map((i: { name: string; price: number; quantity?: number; description?: string }) => ({
        name: i.name,
        unitAmount: i.price,
        quantity: i.quantity || 1,
        description: i.description || 'Araxie student digital asset',
      })),
      totalAmount,
      currency: 'USD',
      customId: customId || `cart-${Date.now()}`,
    });

    return NextResponse.json({
      orderId: result.id,
      simulated: result.simulated,
      totalAmount,
      currency: 'USD',
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
