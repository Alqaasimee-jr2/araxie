import type { Metadata } from 'next';
import PublicPageClient from './PublicPageClient';

export const metadata: Metadata = {
  title: 'Campus Commons (Public Space) — Araxie',
  description: 'The open campus square where university builders showcase peer software, run interactive in-browser tools (Flow7, CI-Guardian), and verify cryptographic licenses.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Araxie Campus Commons — Open University Software Directory',
    description: 'Explore peer-built student software across Stanford, OAU, MIT, and UC Berkeley. Zero sign-in required to try live browser tools.',
    siteName: 'Araxie',
  },
};

export default function PublicPage() {
  return <PublicPageClient />;
}
