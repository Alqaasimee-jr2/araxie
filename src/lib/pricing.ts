import { getAllProducts } from './db';
import { Product } from '@/types';

/**
 * Capped Logarithmic Multi-Tool Discount Model:
 * delta(k) = min(0.25, 0.12 * ln(1 + k))
 * Yields ~12% at k=2, ~17% at k=3, hitting the 25% cap at k=8.
 */
export function calculateServerDiscount(count: number): number {
  if (count <= 1) return 0;
  return Math.min(0.25, 0.12 * Math.log(1 + count));
}

export interface VerifiedCartCalculation {
  verifiedProducts: Product[];
  originalTotal: number;
  discountPercentage: number;
  finalTotal: number;
  savings: number;
  itemShares: Array<{
    productId: string;
    title: string;
    listPrice: number;
    discountedPrice: number;
    creatorPayout: number;
    platformFee: number;
  }>;
}

/**
 * Recomputes cart totals strictly on the server from verified product catalog IDs.
 * Completely ignores any client-supplied or LLM-suggested price amounts.
 */
export function computeVerifiedCartTotal(productIds: string[]): VerifiedCartCalculation {
  const allCatalog = getAllProducts();
  const catalogMap = new Map(allCatalog.map(p => [p.id, p]));

  // Validate that every product ID exists in the catalog (rejecting unauthorized or manipulated IDs)
  const verifiedProducts: Product[] = [];
  for (const id of productIds) {
    const prod = catalogMap.get(id);
    if (prod && !verifiedProducts.some(p => p.id === prod.id)) {
      verifiedProducts.push(prod);
    }
  }

  const originalTotal = Number(
    verifiedProducts.reduce((acc, p) => acc + p.price, 0).toFixed(2)
  );

  const k = verifiedProducts.length;
  const rawDiscount = calculateServerDiscount(k);
  const discountPercentage = Math.round(rawDiscount * 100);
  const finalTotal = Number((originalTotal * (1 - rawDiscount)).toFixed(2));
  const savings = Number((originalTotal - finalTotal).toFixed(2));

  // Pro-rate the bundle discount across items fairly, allocating 95% of captured amount to creator
  const itemShares = verifiedProducts.map(prod => {
    const shareRatio = originalTotal > 0 ? prod.price / originalTotal : 0;
    const discountedPrice = Number((finalTotal * shareRatio).toFixed(2));
    const platformFee = Number((discountedPrice * 0.05).toFixed(2));
    const creatorPayout = Number((discountedPrice - platformFee).toFixed(2));

    return {
      productId: prod.id,
      title: prod.title,
      listPrice: prod.price,
      discountedPrice,
      creatorPayout,
      platformFee,
    };
  });

  return {
    verifiedProducts,
    originalTotal,
    discountPercentage,
    finalTotal,
    savings,
    itemShares,
  };
}
