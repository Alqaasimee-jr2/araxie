import { NextRequest, NextResponse } from 'next/server';
import { getAllReviews, addReview } from '@/lib/db';
import { StudentReview } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;
    const reviews = getAllReviews(productId);
    return NextResponse.json({ reviews });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch reviews';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, authorName, authorUniversity, rating, comment } = body;

    if (!productId || !comment || !rating) {
      return NextResponse.json(
        { error: 'productId, rating, and comment are required' },
        { status: 400 }
      );
    }

    const review: StudentReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId,
      authorName: authorName || 'Verified Student Buyer',
      authorUniversity: authorUniversity || 'Campus Community',
      rating: Math.max(1, Math.min(5, Number(rating))),
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      verifiedBuyer: true,
    };

    const { updatedProduct } = addReview(review);

    return NextResponse.json({
      success: true,
      review,
      updatedProduct,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save review';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
