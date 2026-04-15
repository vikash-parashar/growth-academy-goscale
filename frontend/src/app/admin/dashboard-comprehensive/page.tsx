'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api-url';

interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  completedCourses: number;
  certificatesIssued: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  courseEnrolled?: string;
  attendancePercentage?: number;
  status?: string;
  createdAt?: string;
}

export default function AdminPortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'attendance' | 'certificates'>(
    'dashboard'
  );
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/login');
        return;
      }

      setIsChecking(false);
      await fetchDashboardData(token);
    } catch (err) {
      console.error('Error during auth check:', err);
      setIsChecking(false);
      setError('Authentication failed');
    }
  };

  const fetchDashboardData = async (token: string) => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();

      // Fetch admin stats
      const statsResponse = await fetch(`${apiUrl}/api/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch students list
      const studentsResponse = await fetch(`${apiUrl}/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setStudents(studentsData.students || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/login');
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (isChecking || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">✓ Admin Portal</h1>
            <p className="text-gray-600 mt-1">Dashboard, Student Management & Analytics</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-lg p-2 shadow">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'students', label: '👥 Students', icon: '👥' },
            { id: 'attendance', label: '✓ Attendance', icon: '✓' },
            { id: 'certificates', label: '🎓 Certificates', icon: '🎓' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Students', value: stats.totalStudents, icon: '👥', color: 'bg-blue-100 text-blue-700' },
                { label: 'Active Students', value: stats.activeStudents, icon: '⚡', color: 'bg-green-100 text-green-700' },
                { label: 'Courses Taken', value: stats.completedCourses, icon: '📚', color: 'bg-purple-100 text-purple-700' },
                { label: 'Certificates', value: stats.certificatesIssued, icon: '🎓', color: 'bg-yellow-100 text-yellow-700' },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  className={`${metric.color} rounded-lg p-6 shadow-sm hover:shadow-md transition`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-75">{metric.label}</p>
                      <p className="text-4xl font-bold mt-2">{metric.value}</p>
                    </div>
                    <div className="text-3xl">{metric.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    {stats.totalStudents > 0 ? Math.round((stats.activeStudents / stats.totalStudents) * 100) : 0}%
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {stats.totalStudents > 0 ? Math.round((stats.certificatesIssued / stats.totalStudents) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border-2 border-blue-300 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition">
                  ➕ Add Student
                </button>
                <a
                  href="/admin/certificates"
                  className="p-4 border-2 border-green-300 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium transition text-center"
                >
                  📋 Manage Certificates
                </a>
                <button className="p-4 border-2 border-purple-300 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium transition">
                  📊 View Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Student List ({students.length})</h2>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {filteredStudents.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No students found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.phone || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {student.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Tracking</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Attendance %</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.slice(0, 10).map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${student.attendancePercentage || 85}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{student.attendancePercentage || 85}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          ✓ Present
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Certificate Management</h2>
            <p className="text-gray-600 mb-6">
              Manage and issue certificates for students. 
            </p>
            <a
              href="/admin/certificates"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              → Go to Certificates Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
