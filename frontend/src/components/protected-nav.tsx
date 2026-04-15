'use client';

import Link from 'next/link';
import { useStudent } from '@/contexts/StudentContext';
import { useRouter } from 'next/navigation';

export function ProtectedNav({ navItemClass }: { navItemClass: string }) {
  const { isAuthenticated, student, logout } = useStudent();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    // Unauthenticated user - show only public pages
    return (
      <>
        <Link href="/story" className={navItemClass}>
          Story
        </Link>
        <Link href="/program" className={navItemClass}>
          Program
        </Link>
        <Link href="/podcast" className={navItemClass}>
          Podcast
        </Link>
        <Link href="/proof" className={navItemClass}>
          Proof
        </Link>
        <Link href="/pricing" className={navItemClass}>
          Pricing
        </Link>
        <Link href="/book" className={navItemClass}>
          Book call
        </Link>
        <Link href="/jobs" className={navItemClass}>
          Tech jobs
        </Link>
      </>
    );
  }

  // Authenticated user - show learning + public pages
  return (
    <>
      <Link href="/story" className={navItemClass}>
        Story
      </Link>
      <Link href="/program" className={navItemClass}>
        Program
      </Link>
      <Link href="/learning" className={navItemClass}>
        Learning
      </Link>
      <Link href="/podcast" className={navItemClass}>
        Podcast
      </Link>
      <Link href="/proof" className={navItemClass}>
        Proof
      </Link>
      <Link href="/book" className={navItemClass}>
        Book call
      </Link>
      {student?.role === 'admin' && (
        <Link href="/admin/dashboard" className={navItemClass}>
          Admin
        </Link>
      )}
      <button onClick={handleLogout} className={navItemClass}>
        Logout
      </button>
    </>
  );
}
