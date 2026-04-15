'use client';

import { useEffect, useState } from 'react';
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

interface CertificateViewerProps {
  studentId: number;
}

export default function CertificateViewer({ studentId }: CertificateViewerProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, [studentId]);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('student_token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/students/certificates?studentId=${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch certificates');
      
      const data = await response.json();
      setCertificates(data.certificates || []);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = (cert: Certificate) => {
    if (cert.certificate_url) {
      window.open(cert.certificate_url, '_blank');
    } else {
      alert('Certificate download link not available');
    }
  };

  const shareCertificate = (cert: Certificate) => {
    const text = `I just earned a certificate for "${cert.title}"! Certificate Number: ${cert.certificate_number}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Certificate',
        text: text,
      });
    } else {
      alert(text);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      {certificates.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-900 font-medium">No certificates earned yet</p>
          <p className="text-blue-700 text-sm mt-1">Complete courses to earn certificates</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{cert.title}</h3>
                  <p className="text-sm text-gray-500 font-mono mt-1">#{cert.certificate_number}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Score</p>
                      <p className="text-2xl font-bold text-blue-600">{cert.score.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Attendance</p>
                      <p className="text-2xl font-bold text-green-600">
                        {cert.classes_attended}/{cert.total_classes}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Issued</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(cert.issued_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</p>
                      <p className="text-lg font-semibold text-green-600">✓ Verified</p>
                    </div>
                  </div>

                  {cert.topics_learned && cert.topics_learned.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Topics Learned</p>
                      <div className="flex flex-wrap gap-2">
                        {cert.topics_learned.map((topic, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => shareCertificate(cert)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Certificate Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">Certificate of Completion</h2>
                <p className="text-blue-100 mt-2">This is to certify that</p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-white hover:text-blue-100 text-3xl font-light"
              >
                ×
              </button>
            </div>

            {/* Certificate Body */}
            <div className="p-8 space-y-8">
              {/* Centered Content */}
              <div className="text-center space-y-6 border-b-2 border-gray-300 pb-8">
                <p className="text-2xl font-bold text-gray-900">
                  {selectedCert.title}
                </p>
                <p className="text-gray-600">
                  For successfully completing the course and demonstrating proficiency
                </p>

                <div className="grid grid-cols-3 gap-6 mt-8">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">SCORE</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {selectedCert.score.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">ATTENDANCE</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {((selectedCert.classes_attended / selectedCert.total_classes) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">DATE ISSUED</p>
                    <p className="text-xl font-bold text-gray-900 mt-2">
                      {new Date(selectedCert.issued_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Certificate Details</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-semibold">Certificate Number:</span> {selectedCert.certificate_number}</p>
                    <p><span className="font-semibold">Course:</span> {selectedCert.title}</p>
                    <p><span className="font-semibold">Status:</span> Verified & Approved</p>
                  </div>
                </div>

                {selectedCert.topics_learned && selectedCert.topics_learned.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics Covered</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.topics_learned.map((topic, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Classes Attended:</span> {selectedCert.classes_attended} out of {selectedCert.total_classes}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Attendance Rate:</span>{' '}
                      {((selectedCert.classes_attended / selectedCert.total_classes) * 100).toFixed(0)}%
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Final Score:</span> {selectedCert.score.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Message */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 italic text-gray-700">
                "Congratulations on completing this course! Your dedication and hard work have led to this achievement. 
                We recognize your commitment to professional development."
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 p-6 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium"
              >
                Close
              </button>
              <button
                onClick={() => shareCertificate(selectedCert)}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
              >
                Share Certificate
              </button>
              <button
                onClick={() => downloadCertificate(selectedCert)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
