import fs from 'fs';
import path from 'path';
import { Product, PurchasedItem, PayoutRecord, StudentReview } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

interface DatabaseSchema {
  products: Product[];
  orders: PurchasedItem[];
  payouts: PayoutRecord[];
  reviews: StudentReview[];
}

const INITIAL_REVIEWS: StudentReview[] = [
  {
    id: 'rev-init-1',
    productId: 'prod-canvas-autopilot',
    authorName: 'Damilola Alabi',
    authorUniversity: 'Obafemi Awolowo University (OAU)',
    rating: 5,
    comment: 'Synced my CS 106B and Physics Canvas assignments directly into Notion and Google Calendar. Literally saved my GPA this quarter!',
    date: 'Nov 4, 2026',
    verifiedBuyer: true,
  },
  {
    id: 'rev-init-2',
    productId: 'prod-algo-visualizer',
    authorName: 'Chinedu Okonkwo',
    authorUniversity: 'Federal University of Technology, Akure (FUTA)',
    rating: 5,
    comment: 'The memory pointer stepper helped me finally pass my SWE internship technical interviews. Worth 10x the price.',
    date: 'Nov 5, 2026',
    verifiedBuyer: true,
  },
  {
    id: 'rev-init-3',
    productId: 'prod-academic-suite',
    authorName: 'Emeka Nwosu',
    authorUniversity: 'University of Lagos (UNILAG)',
    rating: 5,
    comment: 'Turned my messy research notes into a formatted IEEE LaTeX draft with citations in under 3 minutes.',
    date: 'Nov 6, 2026',
    verifiedBuyer: true,
  },
];

function ensureDbFile(): DatabaseSchema {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: [
        {
          id: 'rec-order-1',
          productId: 'prod-canvas-autopilot',
          product: INITIAL_PRODUCTS[0],
          purchaseDate: 'Nov 5, 2026',
          orderId: 'ARX-PP-98214-REC',
          captureId: 'PP-CAP-LIVE-09231',
          licenseKey: 'CAP-STAN-9942-2026',
          amountPaid: 6.99,
          status: 'active',
          downloadUrl: 'interactive:canvas-autopilot',
        }
      ],
      payouts: [
        {
          id: 'payout-init-1',
          orderId: 'ARX-PP-98214-REC',
          creatorName: 'Folashade Adeyemi',
          creatorEmail: 'folashade.adeyemi@unilag.edu.ng',
          amount: 6.99,
          platformFee: 0.35,
          timestamp: new Date().toISOString(),
          status: 'SUCCESS',
        }
      ],
      reviews: INITIAL_REVIEWS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Auto-sync missing initial products from catalog
    if (!parsed.products || !Array.isArray(parsed.products)) {
      parsed.products = INITIAL_PRODUCTS;
    } else {
      const existingProductIds = new Set(parsed.products.map((p: Product) => p.id));
      let addedNew = false;
      for (const prod of INITIAL_PRODUCTS) {
        if (!existingProductIds.has(prod.id)) {
          parsed.products.push(prod);
          addedNew = true;
        }
      }
      if (addedNew) {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      }
    }

    if (!parsed.reviews || parsed.reviews.length === 0) {
      parsed.reviews = INITIAL_REVIEWS;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (e) {
    return {
      products: INITIAL_PRODUCTS,
      orders: [],
      payouts: [],
      reviews: INITIAL_REVIEWS,
    };
  }
}

export function getDb(): DatabaseSchema {
  return ensureDbFile();
}

export function saveDb(data: DatabaseSchema): void {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getAllProducts(): Product[] {
  const db = getDb();
  return db.products;
}

export function addProduct(product: Product): Product {
  const db = getDb();
  db.products.unshift(product);
  saveDb(db);
  return product;
}

export function getAllOrders(): PurchasedItem[] {
  const db = getDb();
  return db.orders;
}

export function addOrders(orders: PurchasedItem[]): void {
  const db = getDb();
  db.orders.unshift(...orders);
  saveDb(db);
}

export function getAllPayouts(): PayoutRecord[] {
  const db = getDb();
  return db.payouts || [];
}

export function addPayout(payout: PayoutRecord): void {
  const db = getDb();
  if (!db.payouts) db.payouts = [];
  db.payouts.unshift(payout);
  saveDb(db);
}

export function getAllReviews(productId?: string): StudentReview[] {
  const db = getDb();
  const list = db.reviews || [];
  if (!productId) return list;
  return list.filter(r => r.productId === productId);
}

export function addReview(review: StudentReview): { review: StudentReview; updatedProduct?: Product } {
  const db = getDb();
  if (!db.reviews) db.reviews = [];
  db.reviews.unshift(review);

  // Recalculate product rating & reviewsCount
  const productIdx = db.products.findIndex(p => p.id === review.productId);
  let updatedProduct: Product | undefined;
  if (productIdx !== -1) {
    const prodReviews = db.reviews.filter(r => r.productId === review.productId);
    const sumRatings = prodReviews.reduce((acc, r) => acc + r.rating, 0);
    const newRating = Number((sumRatings / prodReviews.length).toFixed(1));
    db.products[productIdx].rating = newRating;
    db.products[productIdx].reviewsCount = (db.products[productIdx].reviewsCount || 0) + 1;
    updatedProduct = db.products[productIdx];
  }

  saveDb(db);
  return { review, updatedProduct };
}

export function getCreatorStats(creatorEmail: string) {
  const db = getDb();
  const normalizedEmail = creatorEmail.toLowerCase();
  
  // Find creator products
  const creatorProducts = db.products.filter(p => 
    p.creator?.payoutEmail?.toLowerCase() === normalizedEmail ||
    p.creator?.handle?.toLowerCase() === normalizedEmail.split('@')[0]
  );

  // Find creator payouts
  const creatorPayouts = (db.payouts || []).filter(p => 
    p.creatorEmail?.toLowerCase() === normalizedEmail
  );

  // Calculate financials
  const grossSales = creatorPayouts.reduce((acc, p) => acc + (p.amount || 0), 0);
  const platformFees = creatorPayouts.reduce((acc, p) => acc + (p.platformFee || 0), 0);
  const netEarnings = Number((grossSales - platformFees).toFixed(2));
  
  // Calculate total units sold
  const totalUnitsSold = creatorProducts.reduce((acc, p) => acc + (p.salesCount || 0), 0);

  return {
    creatorEmail,
    products: creatorProducts,
    payouts: creatorPayouts,
    grossSales: Number(grossSales.toFixed(2)),
    platformFees: Number(platformFees.toFixed(2)),
    netEarnings,
    totalUnitsSold,
  };
}

