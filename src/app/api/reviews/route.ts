import { NextRequest, NextResponse } from 'next/server';
import { getAllReviews, addReview, getAllOrders } from '@/lib/db';
import { StudentReview } from '@/types';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawProductId = searchParams.get('productId') || undefined;
    const productId = rawProductId ? sanitizeInput(rawProductId, 60) : undefined;
    const reviews = getAllReviews(productId);
    return NextResponse.json({ reviews });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch reviews';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';

    // Anti-spam rate limiting: max 4 reviews per minute per IP
    const rateCheck = checkRateLimit(`reviews:post:${clientIp}`, 4, 60000);
    if (rateCheck.limited) {
      return NextResponse.json(
        { error: 'Review submission rate limit reached. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawProductId = body.productId;
    const rawAuthor = body.authorName;
    const rawUni = body.authorUniversity;
    const rawRating = body.rating;
    const rawComment = body.comment;

    if (!rawProductId || !rawComment || !rawRating) {
      return NextResponse.json(
        { error: 'productId, rating, and comment are required' },
        { status: 400 }
      );
    }

    const productId = sanitizeInput(rawProductId, 60);
    const authorName = sanitizeInput(rawAuthor || 'Verified Student Buyer', 60);
    const authorUniversity = sanitizeInput(rawUni || 'Campus Community', 80);
    const comment = sanitizeInput(rawComment, 400);
    const rating = Math.max(1, Math.min(5, Math.round(Number(rawRating) || 5)));

    if (comment.length < 3) {
      return NextResponse.json(
        { error: 'Comment must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Verify buyer status against actual order ledger
    const orders = getAllOrders();
    const isVerifiedPurchase = orders.some(o => o.productId === productId);

    const review: StudentReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId,
      authorName,
      authorUniversity,
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      verifiedBuyer: isVerifiedPurchase,
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
