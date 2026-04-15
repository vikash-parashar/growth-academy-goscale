'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/glass-card';
import { SiteHeader } from '@/components/site-header';
import { useStudent } from '@/contexts/StudentContext';
import { Toast, useNotification } from '@/components/toast';

interface LoginForm {
  user_id_or_email: string;
  password: string;
}

type LoginMode = 'student' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, login } = useStudent();
  const { notification, showNotification } = useNotification();
  const [loginMode, setLoginMode] = useState<LoginMode>('student');
  const [form, setForm] = useState<LoginForm>({
    user_id_or_email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if session expired
    if (searchParams.get('session') === 'expired') {
      showNotification('Your session has expired. Please log in again.', 'warning', 5000);
    }
  }, [searchParams, showNotification]);

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
      if (!form.user_id_or_email.trim()) throw new Error('User ID/Email or Username required');
      if (!form.password) throw new Error('Password required');

      if (loginMode === 'student') {
        console.log('Starting student login with:', form.user_id_or_email);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id_or_email: form.user_id_or_email,
            password: form.password,
          }),
        });

        console.log('Student login response status:', res.status, res.ok);

        if (!res.ok) {
          const data = await res.json();
          console.error('Student login failed with status', res.status, data);
          throw new Error(data.error || 'Login failed');
        }

        const data = await res.json();
        console.log('Student login response data:', data);
        
        login(data.token, {
          id: data.id,
          email: data.email,
          user_id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name || '',
        });

        showNotification(`Welcome back, ${data.first_name}! You are now in the Student Portal.`, 'success', 3000);
        console.log('Navigating to student learning...');
        setTimeout(() => {
          console.log('Calling router.replace(/learning)');
          router.replace('/learning');
        }, 100);
      } else {
        // Admin login
        console.log('Starting admin login with:', form.user_id_or_email);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.user_id_or_email,
            password: form.password,
          }),
        });

        console.log('Admin login response status:', res.status, res.ok);
        
        if (!res.ok) {
          const data = await res.json();
          console.error('Admin login failed with status', res.status, data);
          throw new Error(data.error || 'Admin login failed');
        }

        const data = await res.json();
        console.log('Admin login response data:', data);
        
        // Store admin token in localStorage and clear student session
        if (data.token) {
          console.log('Token received, storing in localStorage');
          
          // Clear any existing student session
          localStorage.removeItem('studentToken');
          localStorage.removeItem('studentData');
          
          // Store admin token - CRITICAL: do this synchronously first
          localStorage.setItem('adminToken', data.token);
          console.log('✓ Admin token stored in localStorage');
          
          showNotification('Successfully logged into Admin Portal!', 'success', 3000);
          
          // Navigate after token is definitely in localStorage
          console.log('Navigating to admin dashboard...');
          // Use window.location for guaranteed redirection if router doesn't work
          setTimeout(() => {
            console.log('Calling router.replace(/admin/dashboard)');
            router.replace('/admin/dashboard');
          }, 100);
        } else {
          console.error('No token in response:', data);
          throw new Error('No token received from server');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      showNotification(message, 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => {}}
        />
      )}
      <SiteHeader />
      <main className="page-shell py-16 sm:py-24">
        <div className="mx-auto max-w-md">
          <GlassCard className="border-brand-sunset/25 p-8 dark:border-brand-sunset/30">
            {/* Login Mode Toggle */}
            <div className="mb-8 flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900/50">
              <button
                onClick={() => {
                  setLoginMode('student');
                  setForm({ user_id_or_email: '', password: '' });
                  setError(null);
                }}
                className={`flex-1 rounded py-2 px-4 text-sm font-medium transition ${
                  loginMode === 'student'
                    ? 'bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-slate-50'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Student Login
              </button>
              <button
                onClick={() => {
                  setLoginMode('admin');
                  setForm({ user_id_or_email: '', password: '' });
                  setError(null);
                }}
                className={`flex-1 rounded py-2 px-4 text-sm font-medium transition ${
                  loginMode === 'admin'
                    ? 'bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-slate-50'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Admin Login
              </button>
            </div>

            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
              {loginMode === 'student' ? 'Welcome Back' : 'Admin Portal'}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {loginMode === 'student'
                ? 'Login to continue your Go learning journey'
                : 'Access the admin dashboard'}
            </p>

            {error && (
              <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {loginMode === 'student' ? 'User ID or Email' : 'Email or Username'}
                </label>
                <input
                  type="text"
                  name="user_id_or_email"
                  value={form.user_id_or_email}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                  placeholder={
                    loginMode === 'student'
                      ? 'john_doe or john@example.com'
                      : 'admin@gopher.lab'
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
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
                {loading
                  ? loginMode === 'student'
                    ? 'Logging in...'
                    : 'Admin login...'
                  : loginMode === 'student'
                    ? 'Login'
                    : 'Admin Login'}
              </button>
            </form>

            {loginMode === 'student' && (
              <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign up now
                </Link>
              </div>
            )}
          </GlassCard>

          {/* Test Credentials Section */}
          <GlassCard className="mt-8 border-brand-sunset/25 p-6 dark:border-brand-sunset/30">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              🧪 Test Credentials
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  STUDENT ACCOUNT
                </p>
                <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">
                  User ID: <span className="font-semibold">teststudent</span>
                </p>
                <p className="font-mono text-xs text-slate-700 dark:text-slate-300">
                  Password: <span className="font-semibold">TestStudent@2024</span>
                </p>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700" />
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  ADMIN ACCOUNT
                </p>
                <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">
                  Email: <span className="font-semibold">testadmin@gopher.lab</span>
                </p>
                <p className="font-mono text-xs text-slate-700 dark:text-slate-300">
                  Password: <span className="font-semibold">TestAdmin@2024</span>
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
