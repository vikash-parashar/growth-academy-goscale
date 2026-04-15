'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/glass-card';
import { SiteHeader } from '@/components/site-header';
import { useStudent } from '@/contexts/StudentContext';

interface PasswordRequirements {
  minLength: number;
  requirements: string[];
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  user_id: string;
  password: string;
  confirm_password: string;
  goal: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useStudent();
  const [form, setForm] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    user_id: '',
    password: '',
    confirm_password: '',
    goal: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(null);
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [passwordReqs, setPasswordReqs] = useState<PasswordRequirements | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    color: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/learning');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/password-requirements`)
      .then((r) => r.json())
      .then(setPasswordReqs);
  }, []);

  const checkUserIdAvailability = async (userId: string) => {
    if (!userId || userId.length < 3) return;
    setCheckingUserId(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/check-user-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      setUserIdAvailable(data.available);
    } finally {
      setCheckingUserId(false);
    }
  };

  const evaluatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\]/.test(pwd)) score++;

    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

    setPasswordStrength({
      score,
      color: colors[score],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'user_id') {
      checkUserIdAvailability(value);
    }
    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (!form.first_name.trim()) throw new Error('First name required');
      if (!form.last_name.trim()) throw new Error('Last name required');
      if (!form.email.trim()) throw new Error('Email required');
      if (!form.phone.trim()) throw new Error('Phone number required');
      if (!form.user_id.trim()) throw new Error('User ID required');
      if (!form.password) throw new Error('Password required');
      if (form.password !== form.confirm_password) throw new Error('Passwords do not match');
      if (!userIdAvailable && userIdAvailable !== false) throw new Error('Please check user ID availability');
      if (!userIdAvailable) throw new Error('User ID is already taken');

      // Call signup API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Signup failed');
      }

      const data = await res.json();
      login(data.token, {
        id: data.id,
        email: data.email,
        user_id: data.user_id,
        first_name: form.first_name,
        last_name: form.last_name,
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
      <main className="page-shell py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <GlassCard className="border-brand-sunset/25 p-8 dark:border-brand-sunset/30">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">Join Go Developer Bootcamp</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Sign up to start your journey from zero to Go full-stack developer
            </p>

            {error && (
              <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">WhatsApp Number (Optional)</label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={form.whatsapp_number}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                  placeholder="9876543210"
                />
              </div>

              {/* User ID with availability check */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">User ID (Unique) *</label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    name="user_id"
                    value={form.user_id}
                    onChange={handleInputChange}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                    placeholder="john_doe_2024"
                    required
                    minLength={3}
                  />
                  {form.user_id && (
                    <div className="text-sm">
                      {checkingUserId && <span className="text-slate-600 dark:text-slate-400">Checking...</span>}
                      {!checkingUserId && userIdAvailable === null && <span className="text-slate-600 dark:text-slate-400">Enter username</span>}
                      {!checkingUserId && userIdAvailable && <span className="text-green-600 dark:text-green-400">✓ Available</span>}
                      {!checkingUserId && userIdAvailable === false && <span className="text-red-600 dark:text-red-400">✗ Taken</span>}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Letters, numbers, and underscores only (min 3 chars)</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                  placeholder="Enter a strong password"
                  required
                />
                {form.password && passwordStrength && (
                  <div className="mt-3">
                    <div className="overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700">
                      <div
                        className={`h-2 transition-all ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-700 dark:text-slate-300">Password strength requirements:</p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {passwordReqs?.requirements.map((req, i) => (
                        <li key={i} className={form.password?.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>
                          • {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                  placeholder="Confirm your password"
                  required
                />
                {form.confirm_password && form.password !== form.confirm_password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">Passwords do not match</p>
                )}
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Goal (Optional)</label>
                <textarea
                  name="goal"
                  value={form.goal}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 dark:placeholder:text-slate-400"
                  placeholder="e.g., Build scalable microservices with Go"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !userIdAvailable}
                className="btn-accent w-full disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account & Start Learning'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Login here
              </Link>
            </div>
          </GlassCard>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">180</div>
              <p className="text-gray-300">Days of Structured Learning</p>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">0→Hero</div>
              <p className="text-gray-300">Complete Go Bootcamp</p>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
              <p className="text-gray-300">Lifetime Access</p>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
