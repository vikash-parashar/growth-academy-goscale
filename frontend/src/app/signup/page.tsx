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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <SiteHeader />
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Join Go Developer Bootcamp</h1>
            <p className="text-gray-300 mb-8">
              Sign up to start your journey from zero to Go full-stack developer
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number (Optional)</label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={form.whatsapp_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="9876543210"
                />
              </div>

              {/* User ID with availability check */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">User ID (Unique) *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="user_id"
                    value={form.user_id}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="john_doe_2024"
                    required
                    minLength={3}
                  />
                  {form.user_id && (
                    <div className="text-sm">
                      {checkingUserId && <span className="text-gray-400">Checking...</span>}
                      {!checkingUserId && userIdAvailable === null && <span className="text-gray-400">Enter username</span>}
                      {!checkingUserId && userIdAvailable && <span className="text-green-400">✓ Available</span>}
                      {!checkingUserId && userIdAvailable === false && <span className="text-red-400">✗ Taken</span>}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Letters, numbers, and underscores only (min 3 chars)</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter a strong password"
                  required
                />
                {form.password && passwordStrength && (
                  <div className="mt-2">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Password strength requirements:</p>
                    <ul className="text-xs text-gray-400 list-disc list-inside mt-1 space-y-1">
                      {passwordReqs?.requirements.map((req, i) => (
                        <li key={i} className={form.password?.length >= 8 ? 'text-green-400' : ''}>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="Confirm your password"
                  required
                />
                {form.confirm_password && form.password !== form.confirm_password && (
                  <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Goal (Optional)</label>
                <textarea
                  name="goal"
                  value={form.goal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., Build scalable microservices with Go"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !userIdAvailable}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {loading ? 'Creating Account...' : 'Create Account & Start Learning'}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300">
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
      </div>
    </div>
  );
}
