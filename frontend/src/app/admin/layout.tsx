'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useStudent } from '@/contexts/StudentContext';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, token } = useStudent();

  if (!isAuthenticated || !token) {
    router.push('/admin');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
