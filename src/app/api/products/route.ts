import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, addProduct } from '@/lib/db';
import { Product } from '@/types';

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json({ products });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const product: Product = await req.json();
    if (!product || !product.title || !product.price) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }
    const saved = addProduct(product);
    return NextResponse.json({ success: true, product: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
