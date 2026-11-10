import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId') || searchParams.get('id') || '';

  const allProducts = getAllProducts();
  const product = allProducts.find(p => p.id === productId) || allProducts[0];

  const fileName = product.downloadAsset?.fileName || `${product.id}-package.md`;

  const assetContent = `# ${product.title}
================================================================================
Araxie Student Software Marketplace — Verified Digital Asset
Author: ${product.creator.name} (@${product.creator.handle})
Campus: ${product.creator.university}
Category: ${product.category}
Price Paid: $${product.price.toFixed(2)} USD (95% Net Royalties Disbursed to Creator)
Platform: https://araxie.vercel.app
================================================================================

## 🌟 Overview & Tagline
${product.tagline}

${product.description}

## ⚡ Verified Product Features
${product.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

## 🔑 Cryptographic Verification
This digital asset was issued through Araxie's server-side price integrity rails.
Verify your purchase and HMAC cryptographic license signature at:
https://araxie.vercel.app/api/licenses/verify

## 🚀 Quickstart & Usage Instructions
1. For Code Templates & CLI scripts:
   - Run \`npx ${product.id}\` or unzip into your project workspace.
   - Install dependencies: \`npm install\` or \`pip install -r requirements.txt\`
   - Pass your license key via environment variable: \`ARAXIE_LICENSE_KEY=YOUR_KEY\`

2. For Chrome Extensions:
   - Navigate to \`chrome://extensions\`
   - Enable "Developer Mode" (top right toggle)
   - Click "Load Unpacked" and select the extension folder.

3. For Study Packs & Anki Decks:
   - Double-click the .apkg file to auto-import into Anki Desktop.
   - For Notion templates, open the duplicate link and click "Duplicate" (top right).

================================================================================
Support & Creator Contact: ${product.creator.payoutEmail}
Campus Trust Center & FERPA Privacy: https://araxie.vercel.app/terms
================================================================================
`;

  return new NextResponse(assetContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
