import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateServerDiscount, computeVerifiedCartTotal } from '../src/lib/pricing';
import { generateCryptographicLicenseKey, verifyCryptographicLicenseKey } from '../src/lib/licenses';

describe('Server-Side Price Integrity & Capped Logarithmic Discount Model', () => {
  test('returns 0 discount for single or zero items', () => {
    assert.strictEqual(calculateServerDiscount(0), 0);
    assert.strictEqual(calculateServerDiscount(1), 0);
  });

  test('calculates correct dynamic discount curve for 2 and 3 items', () => {
    const discount2 = calculateServerDiscount(2);
    // 0.12 * ln(3) ~ 0.1318
    assert(discount2 > 0.12 && discount2 < 0.14, `Expected ~13%, got ${discount2}`);

    const discount3 = calculateServerDiscount(3);
    // 0.12 * ln(4) ~ 0.1663
    assert(discount3 > 0.15 && discount3 < 0.18, `Expected ~17%, got ${discount3}`);
  });

  test('strictly caps discount at 25% for 8 or more items', () => {
    const discount8 = calculateServerDiscount(8);
    assert.strictEqual(discount8, 0.25);

    const discount15 = calculateServerDiscount(15);
    assert.strictEqual(discount15, 0.25);
  });

  test('computeVerifiedCartTotal filters invalid/malicious product IDs', () => {
    const calculation = computeVerifiedCartTotal([
      'prod-canvas-autopilot',
      'malicious-injected-id-999',
      'prod-algo-visualizer',
    ]);

    // Only the 2 legitimate catalog products must be accepted
    assert.strictEqual(calculation.verifiedProducts.length, 2);
    assert.strictEqual(calculation.originalTotal, 19.49); // 6.99 + 12.50
    assert(calculation.discountPercentage > 0);
    assert(calculation.finalTotal < calculation.originalTotal);
    assert.strictEqual(calculation.finalTotal, Number((calculation.originalTotal - calculation.savings).toFixed(2)));
  });

  test('pro-rates 95% creator payouts accurately across bundled products', () => {
    const calculation = computeVerifiedCartTotal([
      'prod-canvas-autopilot',
      'prod-algo-visualizer',
    ]);

    let totalCreatorPayouts = 0;
    let totalPlatformFees = 0;

    for (const share of calculation.itemShares) {
      assert(share.creatorPayout > 0);
      assert(share.platformFee > 0);
      assert.strictEqual(Number((share.creatorPayout + share.platformFee).toFixed(2)), share.discountedPrice);
      totalCreatorPayouts += share.creatorPayout;
      totalPlatformFees += share.platformFee;
    }

    const netSum = Number((totalCreatorPayouts + totalPlatformFees).toFixed(2));
    assert(Math.abs(netSum - calculation.finalTotal) <= 0.02, `Discrepancy: ${netSum} vs ${calculation.finalTotal}`);
  });
});

describe('Cryptographic HMAC License Key Generation & Verification', () => {
  const prodId = 'prod-flow7';
  const email = 'alex.chen@stanford.edu';
  const orderId = 'ARX-PP-ORD-98214';

  test('generates valid ARX format key with HMAC signature', () => {
    const key = generateCryptographicLicenseKey(prodId, email, orderId);
    assert.match(key, /^ARX-[A-Z0-9]+-[A-Z0-9]+-[A-F0-9]{8}$/);
  });

  test('verifies genuine cryptographic license key', () => {
    const key = generateCryptographicLicenseKey(prodId, email, orderId);
    const verification = verifyCryptographicLicenseKey(key, prodId, email, orderId);
    assert.strictEqual(verification.valid, true);
    assert.strictEqual(verification.key, key);
  });

  test('rejects tampered or forged license key signature', () => {
    const key = generateCryptographicLicenseKey(prodId, email, orderId);
    // Alter last character of HMAC signature
    const tamperedKey = key.slice(0, -1) + (key.slice(-1) === 'A' ? 'B' : 'A');
    const verification = verifyCryptographicLicenseKey(tamperedKey, prodId, email, orderId);
    assert.strictEqual(verification.valid, false);
  });
});
