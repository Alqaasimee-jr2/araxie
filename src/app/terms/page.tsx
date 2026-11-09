import type { Metadata } from 'next';
import TermsPageClient from './TermsPageClient';

export const metadata: Metadata = {
  title: 'Terms of Service & Campus Policies — Araxie',
  description: 'Araxie platform terms of service, student privacy notice (FERPA), creator 95% royalty agreement, campus honor code, and refund policies.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Araxie Legal, Privacy & Campus Policies',
    description: 'Learn about Araxie digital goods licensing, PayPal checkout protections, 95% creator payouts, and academic integrity policies.',
    siteName: 'Araxie',
  },
};

export default function TermsPage() {
  return <TermsPageClient />;
}
