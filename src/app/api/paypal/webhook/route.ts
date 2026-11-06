import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, addOrders } from '@/lib/db';

/**
 * PayPal Webhook Listener for Araxie
 * Receives asynchronous webhook events for order settlement and creator disbursements.
 */
export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const eventType = event.event_type;
    const resource = event.resource;

    console.log(`[PayPal Webhook] Received event: ${eventType} (ID: ${event.id})`);

    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED': {
        const orderId = resource.id;
        console.log(`[PayPal Webhook] Order ${orderId} approved by payer, ready for capture.`);
        break;
      }

      case 'PAYMENT.CAPTURE.COMPLETED': {
        const captureId = resource.id;
        const amount = resource.amount?.value;
        const status = resource.status;
        console.log(`[PayPal Webhook] Capture ${captureId} completed ($${amount} USD, status: ${status})`);
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED': {
        const captureId = resource.id;
        console.warn(`[PayPal Webhook] Capture ${captureId} denied.`);
        break;
      }

      case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED': {
        const itemId = resource.payout_item_id;
        const payoutBatchId = resource.payout_batch_id;
        const receiver = resource.payout_item?.receiver;
        console.log(`[PayPal Webhook] Payout item ${itemId} succeeded for ${receiver} (Batch: ${payoutBatchId})`);
        break;
      }

      default: {
        console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`);
      }
    }

    return NextResponse.json({
      received: true,
      eventId: event.id,
      eventType,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
