export type ProductCategory = 
  | 'chrome-extension' 
  | 'ai-prompt' 
  | 'study-pack' 
  | 'code-template' 
  | 'saas-micro';

export interface Creator {
  name: string;
  handle: string;
  avatar: string;
  university: string;
  verified: boolean;
  payoutEmail: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  university: string;
  role: 'student_buyer' | 'student_creator';
  avatar: string;
  verified: boolean;
  walletBalance?: number;
  payoutEmail?: string;
  major?: string;
  gradYear?: string;
  bio?: string;
}

export interface Product {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  creator: Creator;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  features: string[];
  downloadAsset: {
    type: 'download' | 'github' | 'chrome_web_store' | 'notion_template';
    url: string;
    fileName?: string;
    licenseKeyPrefix: string;
  };
  tags: string[];
  badge?: 'Trending' | 'Staff Pick' | 'New' | 'Bestseller';
  accentColor: string;
  coverImage?: string;
  iconName: string;
}

export interface DynamicBundle {
  id: string;
  title: string;
  items: Product[];
  originalTotal: number;
  discountPercentage: number;
  bundleTotal: number;
  savings: number;
  reason: string;
}

export interface PurchasedItem {
  id: string;
  productId: string;
  product: Product;
  purchaseDate: string;
  orderId: string;
  captureId: string;
  licenseKey: string;
  amountPaid: number;
  status: 'active' | 'revoked';
  downloadUrl: string;
}

export interface PayoutRecord {
  id: string;
  orderId: string;
  creatorName: string;
  creatorEmail: string;
  amount: number;
  platformFee: number;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  bundle?: DynamicBundle;
  suggestedProducts?: Product[];
  timestamp: string;
}

export interface StudentReview {
  id: string;
  productId: string;
  authorName: string;
  authorUniversity: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedBuyer: boolean;
}

