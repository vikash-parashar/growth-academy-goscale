'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/glass-card';
import { SiteHeader } from '@/components/site-header';
import { useStudent } from '@/contexts/StudentContext';

interface LoginForm {
  user_id_or_email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useStudent();
  const [form, setForm] = useState<LoginForm>({
    user_id_or_email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/learning');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!form.user_id_or_email.trim()) throw new Error('User ID or Email required');
      if (!form.password) throw new Error('Password required');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      login(data.token, {
        id: data.id,
        email: data.email,
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name || '',
      });

      router.push('/learning');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main className="page-shell py-16 sm:py-24">
        <div className="mx-auto max-w-md">
          <GlassCard className="border-brand-sunset/25 p-8 dark:border-brand-sunset/30">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">Welcome Back</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Login to continue your Go learning journey</p>

            {error && (
              <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  User ID or Email
                </label>
                <input
                  type="text"
                  name="user_id_or_email"
                  value={form.user_id_or_email}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                  placeholder="john_doe or john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-accent w-full disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Sign up now
              </Link>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
