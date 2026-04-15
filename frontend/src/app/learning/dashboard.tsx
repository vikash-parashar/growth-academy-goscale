'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/glass-card';
import { SiteHeader } from '@/components/site-header';
import { useStudent } from '@/contexts/StudentContext';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';

interface Course {
  id: number;
  title: string;
  description: string;
  duration_days: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
  total_days: number;
}

interface Session {
  id: number;
  session_name: string;
  day_number: number;
  content: string;
  code_examples: string[];
  has_mock_test: boolean;
}

export default function LearningPage() {
  const router = useRouter();
  const { isAuthenticated, student } = useStudent();
  useSessionTimeout(); // Enable 1-hour session timeout
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/signup');
    }
  }, [isAuthenticated, router]);

  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/courses`);
        if (!res.ok) throw new Error('Failed to load courses');
        const data = await res.json();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading courses');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadCourses();
    }
  }, [isAuthenticated]);

  // Load modules when course is selected
  useEffect(() => {
    if (!selectedCourse) return;

    const loadModules = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/students/courses/${selectedCourse.id}/modules`
        );
        if (!res.ok) throw new Error('Failed to load modules');
        const data = await res.json();
        setModules(data || []);
        if (data && data.length > 0) {
          setSelectedModule(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading modules');
      }
    };

    loadModules();
  }, [selectedCourse]);

  // Load sessions when module is selected
  useEffect(() => {
    if (!selectedModule) return;

    const loadSessions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/students/modules/${selectedModule.id}/sessions`
        );
        if (!res.ok) throw new Error('Failed to load sessions');
        const data = await res.json();
        setSessions(data || []);
        if (data && data.length > 0) {
          setSelectedSession(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading sessions');
      }
    };

    loadSessions();
  }, [selectedModule]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pb-20">
      <SiteHeader />

      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {student?.first_name}! 👋
            </h1>
            <p className="text-gray-300">Continue your journey to become a Go developer</p>
          </div>

          {/* Portal Badge */}
          <div className="mb-6 inline-block">
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full">
              <p className="text-blue-200 text-sm font-medium">
                ✓ You are in the <span className="font-semibold">Student Portal</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-400">Loading your learning content...</div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <div className="col-span-1">
                {/* Courses */}
                <GlassCard className="p-4 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Courses</h3>
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course);
                          setSessions([]);
                          setSelectedSession(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                          selectedCourse?.id === course.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        }`}
                      >
                        <div className="text-sm font-medium truncate">{course.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{course.duration_days} days</div>
                      </button>
                    ))}
                  </div>
                </GlassCard>

                {/* Modules */}
                {modules.length > 0 && (
                  <GlassCard className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Modules</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {modules.map((module) => (
                        <button
                          key={module.id}
                          onClick={() => {
                            setSelectedModule(module);
                            setSessions([]);
                            setSelectedSession(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                            selectedModule?.id === module.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                          }`}
                        >
                          <div className="font-medium truncate">{module.title}</div>
                          <div className="text-xs text-gray-500">{module.total_days} days</div>
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </div>

              {/* Main Content */}
              <div className="col-span-3">
                {/* Sessions List */}
                {sessions.length > 0 && (
                  <GlassCard className="p-6 mb-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Sessions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {sessions.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => setSelectedSession(session)}
                          className={`p-4 rounded-lg transition-all text-left ${
                            selectedSession?.id === session.id
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                          }`}
                        >
                          <div className="text-sm font-semibold">Day {session.day_number}</div>
                          <div className="text-sm mt-1 line-clamp-2">{session.session_name}</div>
                          {session.has_mock_test && (
                            <div className="text-xs mt-2 bg-yellow-500/20 text-yellow-300 inline-block px-2 py-1 rounded">
                              📝 Mock Test
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Session Content */}
                {selectedSession && (
                  <GlassCard className="p-6">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        Day {selectedSession.day_number}: {selectedSession.session_name}
                      </h2>
                      {selectedSession.has_mock_test && (
                        <div className="inline-block bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-lg text-sm mt-2">
                          📝 This module has a mock test
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert max-w-none mb-8">
                      <div
                        className="text-gray-300 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: selectedSession.content }}
                      />
                    </div>

                    {/* Code Examples */}
                    {selectedSession.code_examples && selectedSession.code_examples.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Code Examples</h3>
                        {selectedSession.code_examples.map((example, idx) => (
                          <GlassCard key={idx} className="p-4 mb-4 bg-slate-800/50">
                            <div className="font-mono text-sm text-gray-300 overflow-x-auto">
                              <pre>{example}</pre>
                            </div>
                          </GlassCard>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all">
                        ✓ Mark Complete
                      </button>
                      {selectedSession.has_mock_test && (
                        <button className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all">
                          📝 Take Mock Test
                        </button>
                      )}
                      <Link
                        href="/learning/terminal"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all inline-block"
                      >
                        $ Try Code
                      </Link>
                    </div>
                  </GlassCard>
                )}

                {!selectedSession && sessions.length > 0 && (
                  <GlassCard className="p-6 text-center text-gray-400">
                    Select a session to view content
                  </GlassCard>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
