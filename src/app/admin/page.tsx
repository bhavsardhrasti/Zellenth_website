import { redirect } from 'next/navigation';
import type { Route } from 'next';

import { ROUTES } from '@/utils/routes';

export default function AdminIndexPage() {
  redirect(ROUTES.ADMIN_DOOR_CATEGORIES as Route);
}
