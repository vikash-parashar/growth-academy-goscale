'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isTokenExpired } from '@/lib/auth-utils';

interface Student {
  id: number;
  email: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role?: string;
}

interface StudentContextType {
  student: Student | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionExpiresAt: number | null;
  login: (token: string, student: Student) => void;
  logout: () => void;
  signup: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
  refreshSession: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const SESSION_TIMEOUT = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);

  // Define logout first so it can be used in useEffect
  const logout = () => {
    setToken(null);
    setStudent(null);
    setIsAuthenticated(false);
    setSessionExpiresAt(null);
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_data');
    localStorage.removeItem('session_expires_at');
  };

  // Load from localStorage on mount and validate session
  useEffect(() => {
    const storedToken = localStorage.getItem('student_token');
    const storedStudent = localStorage.getItem('student_data');
    const storedExpiry = localStorage.getItem('session_expires_at');

    if (storedToken && storedStudent) {
      // Check if token is expired
      if (isTokenExpired(storedToken)) {
        // Token expired, clear everything
        logout();
        return;
      }

      setToken(storedToken);
      setStudent(JSON.parse(storedStudent));
      setIsAuthenticated(true);

      // Set expiry if stored
      if (storedExpiry) {
        const expiryTime = parseInt(storedExpiry, 10);
        setSessionExpiresAt(expiryTime);

        // Check if session is already expired
        if (expiryTime < Date.now()) {
          logout();
        }
      }
    }
  }, []);

  const login = (newToken: string, studentData: Student) => {
    const expiryTime = Date.now() + SESSION_TIMEOUT; // 1 hour from now

    setToken(newToken);
    setStudent(studentData);
    setIsAuthenticated(true);
    setSessionExpiresAt(expiryTime);

    localStorage.setItem('student_token', newToken);
    localStorage.setItem('student_data', JSON.stringify(studentData));
    localStorage.setItem('session_expires_at', expiryTime.toString());
  };

  const refreshSession = () => {
    if (isAuthenticated) {
      const expiryTime = Date.now() + SESSION_TIMEOUT;
      setSessionExpiresAt(expiryTime);
      localStorage.setItem('session_expires_at', expiryTime.toString());
    }
  };

  const signup = async (data: Record<string, unknown>) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    return response.json();
  };

  // Set up session timeout interval
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiresAt) return;

    const checkSession = setInterval(() => {
      const now = Date.now();
      if (sessionExpiresAt && now >= sessionExpiresAt) {
        logout();
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(checkSession);
  }, [isAuthenticated, sessionExpiresAt]);

  return (
    <StudentContext.Provider
      value={{
        student,
        token,
        isAuthenticated,
        sessionExpiresAt,
        login,
        logout,
        signup,
        refreshSession,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider');
  }
  return context;
}
