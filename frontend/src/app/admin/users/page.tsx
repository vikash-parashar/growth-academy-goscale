'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStudent } from '@/contexts/StudentContext';
import { SiteHeader } from '@/components/site-header';
import { GlassCard } from '@/components/glass-card';

interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_id: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useStudent();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?page=${page}&limit=10`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load users');
        }

        const data = await response.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [isAuthenticated, page, router, token]);

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <div className="page-shell py-12">
        <div>
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link href="/admin/dashboard" className="text-sm text-primary hover:underline">
                ← Back to Dashboard
              </Link>
              <h1 className="mt-4 text-4xl font-bold text-foreground">User Management</h1>
              <p className="mt-2 text-foreground/60">Manage all created users in the system</p>
            </div>
            <Link
              href="/admin/users/create"
              className="rounded bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90"
            >
              + Create User
            </Link>
          </div>

          {/* Error */}
          {error && (
            <GlassCard className="mb-8 border-red-500/30 bg-red-500/10 p-6">
              <p className="text-sm text-red-600">{error}</p>
            </GlassCard>
          )}

          {/* Loading */}
          {loading && (
            <GlassCard className="p-12 text-center">
              <p className="text-foreground/60">Loading users...</p>
            </GlassCard>
          )}

          {/* Users Table */}
          {!loading && users.length > 0 && (
            <div className="overflow-x-auto">
              <GlassCard className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">User ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr
                        key={user.id}
                        className={`border-b border-foreground/5 ${idx % 2 === 0 ? 'bg-foreground/2' : ''} hover:bg-foreground/5`}
                      >
                        <td className="px-6 py-4 text-sm text-foreground">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground/70">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-foreground/70">{user.phone}</td>
                        <td className="px-6 py-4 text-sm font-mono text-primary">{user.user_id}</td>
                        <td className="px-6 py-4 text-sm text-foreground/70">
                          <span className="rounded bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                            {user.role || 'student'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground/70">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          )}

          {/* No Users */}
          {!loading && users.length === 0 && (
            <GlassCard className="p-12 text-center">
              <p className="text-foreground/60">No users found</p>
              <Link
                href="/admin/users/create"
                className="mt-4 inline-block rounded bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Create First User
              </Link>
            </GlassCard>
          )}

          {/* Pagination */}
          {!loading && total > 10 && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded border border-foreground/20 px-4 py-2 text-sm font-medium hover:bg-foreground/5 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-foreground/70">
                Page {page} of {Math.ceil(total / 10)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * 10 >= total}
                className="rounded border border-foreground/20 px-4 py-2 text-sm font-medium hover:bg-foreground/5 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
