import type { Metadata } from 'next';

import { ZoneEditorView } from '@/views/admin/doors/zone-editor/ZoneEditorView';

export const metadata: Metadata = {
  title: 'Zone Editor | Admin | Zellenth',
};

interface AdminDoorZonesPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminDoorZonesPage({ params }: AdminDoorZonesPageProps) {
  const { id } = await params;
  return <ZoneEditorView doorId={id} />;
}
