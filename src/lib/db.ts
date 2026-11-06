import fs from 'fs';
import path from 'path';
import { Product, PurchasedItem, PayoutRecord } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

interface DatabaseSchema {
  products: Product[];
  orders: PurchasedItem[];
  payouts: PayoutRecord[];
}

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
          id: 'demo-order-1',
          productId: 'prod-canvas-autopilot',
          product: INITIAL_PRODUCTS[0],
          purchaseDate: 'Nov 5, 2026',
          orderId: 'ARX-PP-SANDBOX-DEMO-01',
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
          orderId: 'ARX-PP-SANDBOX-DEMO-01',
          creatorName: 'Sarah Lin',
          creatorEmail: 'sarah.lin@stanford.edu',
          amount: 6.99,
          platformFee: 0.35,
          timestamp: new Date().toISOString(),
          status: 'SUCCESS',
        }
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return {
      products: INITIAL_PRODUCTS,
      orders: [],
      payouts: [],
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
  return db.payouts;
}

export function addPayout(payout: PayoutRecord): void {
  const db = getDb();
  db.payouts.unshift(payout);
  saveDb(db);
}
