import type { Metadata } from 'next';

import { ReliefDemoView } from '@/views/admin/relief-demo/ReliefDemoView';

export const metadata: Metadata = {
  title: 'Relief Demo | Admin | Zellenth',
};

export default function AdminReliefDemoPage() {
  return <ReliefDemoView />;
}
