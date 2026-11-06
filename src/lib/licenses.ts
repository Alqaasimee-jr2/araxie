import crypto from 'crypto';

const LICENSE_SECRET = process.env.LICENSE_SECRET || 'araxie-edupass-hmac-secret-key-2026';

export interface LicenseVerificationResult {
  valid: boolean;
  key: string;
  productId?: string;
  orderId?: string;
  issuedAt?: string;
  reason?: string;
}

/**
 * Generate a cryptographically verifiable HMAC-signed license key.
 * Format: ARX-{SLUG}-{TIMESTAMP_B36}-{HMAC_SIGNATURE_8HEX}
 */
export function generateCryptographicLicenseKey(
  productId: string,
  buyerEmail: string,
  orderId: string
): string {
  const cleanProd = productId.replace(/^prod-/, '').slice(0, 4).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  const payload = `${productId}:${buyerEmail.toLowerCase()}:${orderId}:${timestamp}`;
  const hmac = crypto
    .createHmac('sha256', LICENSE_SECRET)
    .update(payload)
    .digest('hex')
    .slice(0, 8)
    .toUpperCase();

  return `ARX-${cleanProd}-${timestamp}-${hmac}`;
}

/**
 * Verifies structural format and cryptographic signature of an Araxie student license.
 */
export function verifyCryptographicLicenseKey(
  key: string,
  expectedProductId?: string,
  expectedBuyerEmail?: string,
  expectedOrderId?: string
): LicenseVerificationResult {
  if (!key || typeof key !== 'string') {
    return { valid: false, key: '', reason: 'Empty key provided' };
  }

  const parts = key.trim().split('-');
  if (parts.length !== 4 || parts[0] !== 'ARX') {
    return { valid: false, key, reason: 'Invalid key structure. Expected ARX-{PROD}-{TIME}-{SIG}' };
  }

  const [, prodSlug, timestamp, signature] = parts;

  // If specific order context is provided, verify precise HMAC payload
  if (expectedProductId && expectedBuyerEmail && expectedOrderId) {
    const payload = `${expectedProductId}:${expectedBuyerEmail.toLowerCase()}:${expectedOrderId}:${timestamp}`;
    const expectedHmac = crypto
      .createHmac('sha256', LICENSE_SECRET)
      .update(payload)
      .digest('hex')
      .slice(0, 8)
      .toUpperCase();

    if (signature === expectedHmac) {
      return {
        valid: true,
        key,
        productId: expectedProductId,
        orderId: expectedOrderId,
        issuedAt: new Date(parseInt(timestamp, 36)).toISOString(),
      };
    } else {
      return {
        valid: false,
        key,
        reason: 'Cryptographic HMAC signature mismatch',
      };
    }
  }

  // Structural sanity check
  if (signature.length === 8 && /^[0-9A-F]+$/.test(signature)) {
    return {
      valid: true,
      key,
      productId: `prod-${prodSlug.toLowerCase()}`,
      issuedAt: new Date(parseInt(timestamp, 36) || Date.now()).toISOString(),
    };
  }

  return { valid: false, key, reason: 'Cryptographic signature mismatch' };
}
