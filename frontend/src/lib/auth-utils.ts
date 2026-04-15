/**
 * Authentication utility functions
 * Handles JWT validation, token expiration, and access control
 */

interface TokenPayload {
  exp: number;
  iat: number;
  [key: string]: unknown;
}

/**
 * Decode JWT token (basic decoding, verification should happen on backend)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Get time remaining for token expiration
 */
export function getTokenExpiryTime(token: string): number | null {
  const payload = decodeToken(token);
  if (!payload) return null;

  const currentTime = Math.floor(Date.now() / 1000);
  const timeRemaining = (payload.exp - currentTime) * 1000; // Convert to milliseconds

  return timeRemaining > 0 ? timeRemaining : null;
}

/**
 * Set up token expiration warning (e.g., warn before session timeout)
 */
export function setupTokenExpirationWarning(
  expiryTime: number,
  onWarning: () => void,
  warningThreshold: number = 5 * 60 * 1000 // Warn 5 minutes before expiration
) {
  if (expiryTime <= warningThreshold) {
    onWarning();
    return null;
  }

  return setTimeout(onWarning, expiryTime - warningThreshold);
}

/**
 * Public pages (no authentication required)
 */
export const PUBLIC_PAGES = new Set([
  '/',
  '/story',
  '/program',
  '/login',
  '/signup',
  '/error',
  '/404',
]);

/**
 * Protected pages (authentication required)
 */
export const PROTECTED_PAGES = new Set([
  '/content',
  '/learning',
  '/proof',
  '/pricing',
  '/mock-test',
  '/career-comparison',
  '/jobs',
  '/dashboard',
  '/admin',
  '/admin/dashboard',
  '/book',
  '/pay',
  '/connect',
  '/proof/page',
]);

/**
 * Check if a page requires authentication
 */
export function isProtectedPage(pathname: string): boolean {
  // Check exact match
  if (PROTECTED_PAGES.has(pathname)) return true;

  // Check if pathname starts with protected route
  for (const page of PROTECTED_PAGES) {
    if (pathname.startsWith(page + '/')) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a page is public-only (user must not be logged in)
 */
export function isPublicOnlyPage(pathname: string): boolean {
  return pathname === '/login' || pathname === '/signup';
}
