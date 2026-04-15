'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CertificateViewer from '@/components/certificate-viewer';
import { getApiUrl } from '@/lib/api-url';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
}

interface StudentData {
  id: number;
  name: string;
  email: string;
}

export default function LearningPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates'>('courses');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('student_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const apiUrl = getApiUrl();
      // Verify token is valid by checking student info
      const response = await fetch(`${apiUrl}/api/students/check-user-id`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => null);

      if (!response?.ok) {
        localStorage.removeItem('student_token');
        router.push('/login');
        return;
      }

      // Extract student data from token if available
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setStudentData({
        id: tokenPayload.sub || 0,
        name: tokenPayload.name || 'Student',
        email: tokenPayload.email || '',
      });

      fetchCourses();
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('student_token');
      router.push('/login');
    } finally {
      setIsChecking(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/students/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('student_token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch courses');
      
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    router.push('/login');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Portal</h1>
              <p className="text-gray-600 mt-1">✓ Student Portal</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Logout
            </button>
          </div>
          {studentData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                Welcome, <span className="font-semibold">{studentData.name}</span>! 
                <span className="ml-2 text-gray-600">({studentData.email})</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'courses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Enrolled Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'certificates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Certificates
          </button>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <p className="text-blue-900 font-medium text-lg">No courses enrolled yet</p>
                <p className="text-blue-700 mt-2">Browse and enroll in available courses to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-semibold text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
                      Continue Learning
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && studentData && (
          <div>
            <CertificateViewer studentId={studentData.id} />
          </div>
        )}
      </div>
    </div>
  );
}
