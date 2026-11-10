import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

function resetDemoDb() {
  if (!fs.existsSync(DB_FILE)) {
    console.log('db.json does not exist. Nothing to reset.');
    return;
  }

  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  const db = JSON.parse(raw);

  const prevOrdersCount = db.orders ? db.orders.length : 0;
  const prevPayoutsCount = db.payouts ? db.payouts.length : 0;

  // Clear orders and payouts so student account starts 100% fresh
  db.orders = [];
  db.payouts = [];

  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');

  console.log(`Successfully reset demo database:`);
  console.log(`- Cleared ${prevOrdersCount} previous orders (Student Locker is now fresh & empty)`);
  console.log(`- Cleared ${prevPayoutsCount} previous payout logs`);
  console.log(`- Retained ${db.products?.length || 0} catalog products`);
  console.log(`- Retained ${db.reviews?.length || 0} verified student reviews`);
}

resetDemoDb();
