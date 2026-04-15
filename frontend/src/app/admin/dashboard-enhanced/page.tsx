'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api-url';

interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  completedCourses: number;
  certificatesIssued: number;
}

interface StudentAttendance {
  id: number;
  name: string;
  email: string;
  course: string;
  attendancePercentage: number;
  classesAttended: number;
  totalClasses: number;
  status: 'present' | 'absent' | 'on-track' | 'at-risk';
}

interface AdminStats {
  stats: StudentStats;
  recentStudents: StudentAttendance[];
  monthlyGrowth: Array<{ month: string; count: number }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'certificates' | 'analytics'>(
    'overview'
  );
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    checkAuthAndFetchStats();
  }, []);

  const checkAuthAndFetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = getApiUrl();

      // Fetch admin statistics
      const response = await fetch(`${apiUrl}/api/admin/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setAdminStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const stats = adminStats?.stats;
  const students = adminStats?.recentStudents || [];
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'on-track':
        return 'bg-blue-100 text-blue-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return '✓ Present';
      case 'on-track':
        return '→ On Track';
      case 'at-risk':
        return '⚠ At Risk';
      case 'absent':
        return '✗ Absent';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">✓ Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage students, track attendance, and monitor progress</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
                </div>
                <div className="text-3xl text-blue-600">👥</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stats.activeStudents} currently active</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Certificates Issued</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.certificatesIssued}</p>
                </div>
                <div className="text-3xl text-green-600">🎓</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Course completions</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Courses Taken</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedCourses}</p>
                </div>
                <div className="text-3xl text-purple-600">📚</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Total enrollments</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {Math.round((stats.activeStudents / stats.totalStudents) * 100)}%
                  </p>
                </div>
                <div className="text-3xl text-yellow-600">⚡</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Engagement rate</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 bg-white rounded-lg p-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
              activeTab === 'attendance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Student Attendance
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
              activeTab === 'certificates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Certificates
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-2 px-4 font-medium border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-blue-300 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-center">
                  ➕ Add New Student
                </button>
                <button className="p-4 border border-green-300 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium text-center">
                  📋 Create Certificate
                </button>
                <button className="p-4 border border-purple-300 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium text-center">
                  📊 Generate Report
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">📚 New course enrollment</p>
                    <p className="text-sm text-gray-600">5 new students enrolled today</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">🎓 Certificates issued</p>
                    <p className="text-sm text-gray-600">3 students completed their course</p>
                  </div>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Student Attendance Tracking</h2>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {filteredStudents.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No students found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.course}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${student.attendancePercentage}%` }}
                                ></div>
                              </div>
                              <span className="font-medium text-gray-900">
                                {student.attendancePercentage}% ({student.classesAttended}/{student.totalClasses})
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                              {getStatusLabel(student.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Certificate Management</h2>
            <p className="text-gray-600">
              Go to the <button className="text-blue-600 underline hover:text-blue-800 font-medium">/admin/certificates</button> page to manage certificates.
            </p>
            <div className="mt-6">
              <a
                href="/admin/certificates"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                → View Certificates Dashboard
              </a>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics & Reports</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Growth</h3>
                <div className="flex items-end justify-between gap-2 h-40">
                  {adminStats?.monthlyGrowth?.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="flex items-end justify-center w-full">
                        <div
                          className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-colors"
                          style={{ height: `${(item.count / 100) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{item.month}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium">Average Attendance</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {stats ? Math.round((stats.activeStudents / stats.totalStudents) * 100) : 0}%
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {stats ? Math.round((stats.certificatesIssued / stats.totalStudents) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
