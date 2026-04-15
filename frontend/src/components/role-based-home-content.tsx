'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicHomePageContent } from '@/components/public-home-page-content';
import { getApiUrl } from '@/lib/api-url';

type PageProps = {
  whatsappDigits: string;
};

export function RoleBasedHomePageContent({ whatsappDigits }: PageProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'public' | 'redirecting'>('loading');

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      // Check for admin token
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken) {
        setStatus('redirecting');
        router.push('/admin/dashboard');
        return;
      }

      // Check for student token
      const studentToken = localStorage.getItem('student_token');
      if (studentToken) {
        setStatus('redirecting');
        router.push('/learning/dashboard');
        return;
      }

      // No token - show public page
      setStatus('public');
    } catch (error) {
      console.error('Error checking user role:', error);
      setStatus('public');
    }
  };

  if (status === 'redirecting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Redirecting you...</p>
        </div>
      </div>
    );
  }

  if (status === 'public') {
    return <PublicHomePageContent whatsappDigits={whatsappDigits} />;
  }

  return null;
}
