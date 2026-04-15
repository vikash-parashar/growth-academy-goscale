'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (token: string, student: Student) => void;
  logout: () => void;
  signup: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('student_token');
    const storedStudent = localStorage.getItem('student_data');
    if (storedToken && storedStudent) {
      setToken(storedToken);
      setStudent(JSON.parse(storedStudent));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (newToken: string, studentData: Student) => {
    setToken(newToken);
    setStudent(studentData);
    setIsAuthenticated(true);
    localStorage.setItem('student_token', newToken);
    localStorage.setItem('student_data', JSON.stringify(studentData));
  };

  const logout = () => {
    setToken(null);
    setStudent(null);
    setIsAuthenticated(false);
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_data');
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

  return (
    <StudentContext.Provider
      value={{
        student,
        token,
        isAuthenticated,
        login,
        logout,
        signup,
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
