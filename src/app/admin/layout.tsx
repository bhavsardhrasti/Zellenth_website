import { redirect } from 'next/navigation';
import type { Route } from 'next';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { requireAdmin } from '@/lib/auth';
import { AdminShell } from '@/views/admin/AdminShell';
import { ROUTES } from '@/utils/routes';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  let user;
  try {
    user = await requireAdmin();
  } catch {
    redirect(ROUTES.LOGIN as Route);
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <AdminShell userName={user.name ?? 'Admin'} userEmail={user.email ?? ''}>
        {children}
      </AdminShell>
    </>
  );
}
