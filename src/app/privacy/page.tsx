import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Privacy Policy & Student Data Protection — Araxie',
  description: 'How Araxie collects, uses, and safeguards student information, FERPA alignment, and payment data.',
};

export default function PrivacyPage() {
  redirect('/terms#privacy');
}
