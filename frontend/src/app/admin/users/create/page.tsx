'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStudent } from '@/contexts/StudentContext';
import { SiteHeader } from '@/components/site-header';
import { GlassCard } from '@/components/glass-card';

type DeliveryMethod = 'email' | 'sms' | 'whatsapp';

interface CreateUserResponse {
  success: boolean;
  username: string;
  temporary_password: string;
  user_id: string;
  message: string;
}

export default function CreateUserPage() {
  const { isAuthenticated, token } = useStudent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<CreateUserResponse | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    delivery_method: 'email' as DeliveryMethod,
  });

  if (!isAuthenticated) {
    return (
      <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
        <SiteHeader />
        <div className="page-shell py-16 text-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="mt-4 text-foreground/70">You must be logged in as an admin to access this page.</p>
          <Link href="/admin" className="mt-8 inline-block rounded bg-primary px-6 py-2 text-white hover:bg-primary/90">
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateUsername = (): string => {
    const uniqueId = Math.random().toString(36).substring(2, 9);
    return `user_${uniqueId}`;
  };

  const generatePassword = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Validate form
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Validate phone
      if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
        setError('Please enter a valid phone number (at least 10 digits)');
        setLoading(false);
        return;
      }

      const username = generateUsername();
      const password = generatePassword();

      const payload = {
        ...formData,
        username,
        temporary_password: password,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const data: CreateUserResponse = await response.json();
      setSuccess(data);

      // Reset form after successful creation
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        delivery_method: 'email',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <div className="page-shell py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/dashboard" className="text-sm text-primary hover:underline">
              ← Back to Dashboard
            </Link>
            <h1 className="mt-4 text-4xl font-bold text-foreground">Create New User</h1>
            <p className="mt-2 text-foreground/60">Generate a new user account with automatic credentials</p>
          </div>

          {/* Success Message */}
          {success && (
            <GlassCard className="mb-8 border-green-500/30 bg-green-500/10 p-6">
              <h3 className="font-semibold text-green-600">✓ User Created Successfully</h3>
              <div className="mt-4 space-y-2 text-sm text-foreground/80">
                <p>
                  <strong>User ID:</strong> {success.user_id}
                </p>
                <p>
                  <strong>Username:</strong> {success.username}
                </p>
                <p>
                  <strong>Password:</strong> {success.temporary_password}
                </p>
                <p className="mt-4 text-foreground/60">
                  Credentials have been sent via {formData.delivery_method.toUpperCase()} to{' '}
                  {formData.delivery_method === 'email' ? formData.email : formData.phone}
                </p>
              </div>
            </GlassCard>
          )}

          {/* Error Message */}
          {error && (
            <GlassCard className="mb-8 border-red-500/30 bg-red-500/10 p-6">
              <h3 className="font-semibold text-red-600">✗ Error</h3>
              <p className="mt-2 text-sm text-foreground/80">{error}</p>
            </GlassCard>
          )}

          {/* Form */}
          <GlassCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name */}
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-foreground">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  className="mt-2 w-full rounded border border-foreground/20 bg-background/50 px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
                  disabled={loading}
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-foreground">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="mt-2 w-full rounded border border-foreground/20 bg-background/50 px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="mt-2 w-full rounded border border-foreground/20 bg-background/50 px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
                  disabled={loading}
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1-234-567-8900"
                  className="mt-2 w-full rounded border border-foreground/20 bg-background/50 px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
                  disabled={loading}
                />
              </div>

              {/* Delivery Method */}
              <div>
                <label htmlFor="delivery_method" className="block text-sm font-medium text-foreground">
                  Delivery Method for Credentials
                </label>
                <select
                  id="delivery_method"
                  name="delivery_method"
                  value={formData.delivery_method}
                  onChange={handleChange}
                  className="mt-2 w-full rounded border border-foreground/20 bg-background/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                  disabled={loading}
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Creating User...' : 'Create User & Send Credentials'}
              </button>
            </form>
          </GlassCard>

          {/* Help Section */}
          <GlassCard className="mt-8 border-foreground/10 p-6">
            <h3 className="font-semibold text-foreground">How it works</h3>
            <ul className="mt-4 space-y-2 text-sm text-foreground/70">
              <li>
                ✓ Enter the user&apos;s details below
              </li>
              <li>✓ A unique username and temporary password will be auto-generated</li>
              <li>✓ Credentials will be sent via your chosen method (email, SMS, or WhatsApp)</li>
              <li>✓ User can log in and change password on first login</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
