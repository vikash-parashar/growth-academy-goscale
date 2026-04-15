'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api-url';

interface Certificate {
  id: number;
  student_id: number;
  course_id: number;
  title: string;
  issued_date: string;
  completion_date: string;
  classes_attended: number;
  total_classes: number;
  score: number;
  topics_learned: string[];
  certificate_number: string;
  certificate_url?: string;
  status: 'pending' | 'approved' | 'issued' | 'rejected';
  verified_by?: number;
  created_at: string;
  updated_at: string;
}

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchCertificates();
  };

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = getApiUrl();
      
      const endpoint = activeTab === 'pending' 
        ? `${apiUrl}/api/admin/certificates/pending`
        : `${apiUrl}/api/admin/certificates`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch certificates');
      
      const data = await response.json();
      setCertificates(data.certificates || data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (certId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/api/admin/certificates/${certId}/issue`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to issue certificate');
      
      await fetchCertificates();
      setSelectedCert(null);
    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert('Failed to issue certificate');
    }
  };

  const handleReject = async (certId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/api/admin/certificates/${certId}/reject`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to reject certificate');
      
      await fetchCertificates();
      setSelectedCert(null);
    } catch (error) {
      console.error('Error rejecting certificate:', error);
      alert('Failed to reject certificate');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      issued: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return statusMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
  };

  const filteredCerts = certificates.filter(cert =>
    searchTerm === '' || 
    cert.certificate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificates</h1>
          <p className="text-gray-600">Manage student certificates and approvals</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('all');
              fetchCertificates();
            }}
            className={`pb-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Certificates
          </button>
          <button
            onClick={() => {
              setActiveTab('pending');
              fetchCertificates();
            }}
            className={`pb-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Approval ({certificates.filter(c => c.status === 'pending').length})
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by certificate number or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Certificates Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredCerts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No certificates found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Certificate #</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Course</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Score</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Attendance</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Issued Date</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">{cert.certificate_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cert.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cert.score.toFixed(1)}%</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {cert.classes_attended}/{cert.total_classes}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(cert.status)}`}>
                          {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(cert.issued_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Certificate Details</h2>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Certificate Number</p>
                  <p className="text-lg font-mono text-gray-900">{selectedCert.certificate_number}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Status</p>
                  <p className={`text-lg font-medium ${getStatusBadge(selectedCert.status)}`}>
                    {selectedCert.status.charAt(0).toUpperCase() + selectedCert.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Course</p>
                  <p className="text-lg text-gray-900">{selectedCert.title}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Score</p>
                  <p className="text-lg text-gray-900">{selectedCert.score.toFixed(1)}%</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Topics Learned</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCert.topics_learned && selectedCert.topics_learned.map((topic, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Issued Date</p>
                  <p className="text-gray-900">{new Date(selectedCert.issued_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Attendance</p>
                  <p className="text-gray-900">{selectedCert.classes_attended}/{selectedCert.total_classes}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedCert.status === 'pending' && (
              <div className="border-t border-gray-200 p-6 flex gap-3 justify-end">
                <button
                  onClick={() => handleReject(selectedCert.id)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleIssue(selectedCert.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Approve & Issue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
