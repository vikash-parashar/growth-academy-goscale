'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStudent } from '@/contexts/StudentContext';
import { isProtectedPage, isPublicOnlyPage, isTokenExpired } from '@/lib/auth-utils';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected route wrapper component
 * Redirects unauthenticated users to login for protected pages
 * Redirects authenticated users away from public-only pages (like /login)
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, token } = useStudent();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if current page is protected
    const pageIsProtected = isProtectedPage(pathname);
    const pageIsPublicOnly = isPublicOnlyPage(pathname);

    // If page is protected and user is not authenticated
    if (pageIsProtected && !isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(pathname));
      return;
    }

    // If token exists, check if it's expired
    if (token && isTokenExpired(token)) {
      // Token is expired, logout user
      router.push('/login?expired=true');
      return;
    }

    // If page is public-only (like login/signup) and user is authenticated
    if (pageIsPublicOnly && isAuthenticated) {
      router.push('/dashboard');
      return;
    }

    setIsChecking(false);
  }, [pathname, isAuthenticated, token, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse">
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook to enforce protection on a component
 * Use this for more granular control within components
 */
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, token } = useStudent();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (token && isTokenExpired(token)) {
      router.push('/login?expired=true');
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, token, router]);

  return isAuthorized;
}
