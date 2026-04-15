'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudent } from '@/contexts/StudentContext';
import { SiteHeader } from '@/components/site-header';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_id: string;
  goal: string;
  status: string;
  created_at: string;
}

interface StudentDetail extends Student {
  payment?: {
    plan_name: string;
    total_amount_paise: number;
    paid_amount_paise: number;
    pending_amount_paise: number;
    status: string;
    percentage_paid: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, token } = useStudent();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadStudents();
  }, [isAuthenticated, page]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/students?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load students');
      const data = await res.json();
      setStudents(data.students || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentDetail = async (studentId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load student detail');
      const data = await res.json();
      setSelectedStudent(data);
    } catch (error) {
      console.error('Error loading student detail:', error);
    }
  };

  const sendNotification = async (type: 'email' | 'sms', message: string) => {
    if (!selectedStudent) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/students/${selectedStudent.id}/notify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type,
            title: 'Notification from Admin',
            message,
          }),
        }
      );
      if (res.ok) {
        alert(`${type.toUpperCase()} sent successfully!`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <SiteHeader />
      <div className="page-shell py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Students ({total})</h2>
            <div className="space-y-2">
              {loading ? (
                <p className="text-gray-300">Loading...</p>
              ) : students.length === 0 ? (
                <p className="text-gray-300">No students found</p>
              ) : (
                <>
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => loadStudentDetail(student.id)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedStudent?.id === student.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="font-semibold">
                        {student.first_name} {student.last_name}
                      </div>
                      <div className="text-sm">{student.email}</div>
                    </button>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 py-2 bg-slate-700 text-white rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="px-3 py-2 text-white">Page {page}</span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={students.length < 10}
                      className="px-3 py-2 bg-slate-700 text-white rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Student Details */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            {selectedStudent ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-gray-300">
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <p className="text-white">{selectedStudent.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Phone</label>
                      <p className="text-white">{selectedStudent.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">User ID</label>
                      <p className="text-white">{selectedStudent.user_id}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Status</label>
                      <p className="text-white">{selectedStudent.status}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-gray-400">Goal</label>
                      <p className="text-white">{selectedStudent.goal}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-gray-400">Joined</label>
                      <p className="text-white">{new Date(selectedStudent.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                {selectedStudent.payment && (
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-3">Payment Information</h3>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="text-white font-semibold">₹{(selectedStudent.payment.total_amount_paise / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid Amount:</span>
                        <span className="text-green-400 font-semibold">₹{(selectedStudent.payment.paid_amount_paise / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="text-red-400 font-semibold">₹{(selectedStudent.payment.pending_amount_paise / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completion:</span>
                        <span className="text-white font-semibold">{selectedStudent.payment.percentage_paid}%</span>
                      </div>
                      <div className="mt-3 bg-slate-700/50 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                          style={{ width: `${selectedStudent.payment.percentage_paid}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-3">Send Notification</h3>
                  <div className="space-y-3">
                    <textarea
                      id="notification-message"
                      placeholder="Enter message..."
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const msg = (document.getElementById('notification-message') as HTMLTextAreaElement)?.value;
                          if (msg) sendNotification('email', msg);
                        }}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Send Email
                      </button>
                      <button
                        onClick={() => {
                          const msg = (document.getElementById('notification-message') as HTMLTextAreaElement)?.value;
                          if (msg) sendNotification('sms', msg);
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Send SMS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-lg">Select a student to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
