'use client';

import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api-url';

interface CertificateData {
  certificate: {
    id: number;
    student_id: number;
    course_id: number;
    title: string;
    issued_date: string;
    completion_date?: string;
    classes_attended: number;
    total_classes: number;
    score: number;
    topics_learned: string[];
    certificate_number: string;
    certificate_url?: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  preview: {
    student_name: string;
    course_name: string;
    score: number;
    classes_attended: number;
    total_classes: number;
    topics_learned: string[];
    certificate_number: string;
    issued_date: string;
  };
  formats: string[];
}

interface CertificatePreviewProps {
  certificateId: number;
  studentName?: string;
  onClose?: () => void;
}

export function CertificatePreview({ certificateId, studentName = 'John Doe', onClose }: CertificatePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCertificateData();
  }, [certificateId]);

  const fetchCertificateData = async () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('student_token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/certificates/${certificateId}/preview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch certificate');
      
      const data = await response.json();
      data.preview.student_name = studentName;
      setCertData(data);
    } catch (err) {
      console.error('Error fetching certificate:', err);
      setError('Failed to load certificate preview');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (format: 'pdf' | 'png' | 'jpeg') => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('admin_token') || localStorage.getItem('student_token');
      if (!token) {
        alert('Not authenticated');
        return;
      }

      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/api/certificates/${certificateId}/download/${format}`;
      
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to download ${format.toUpperCase()}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${certData?.certificate.certificate_number}.${format === 'jpeg' ? 'jpg' : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert(`Failed to download ${format.toUpperCase()}`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        {error || 'Failed to load certificate'}
      </div>
    );
  }

  const { preview, certificate } = certData;
  const attendancePercentage = (preview.classes_attended / preview.total_classes) * 100;

  return (
    <div className="space-y-6">
      {/* Certificate Display Area */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border-8 border-amber-50">
        <div className="bg-gradient-to-b from-amber-50 to-white p-12 text-center min-h-96 flex flex-col justify-center">
          {/* Top Decoration */}
          <div className="mb-4">
            <div className="text-5xl font-bold text-amber-600">🏆</div>
          </div>

          {/* Institution Name */}
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Gopher Lab</h1>
          <p className="text-lg text-gray-600 mb-8">Professional Backend Development Training Institute</p>

          {/* Certificate Title */}
          <div className="border-t-4 border-b-4 border-amber-600 py-6 mb-8">
            <h2 className="text-3xl font-bold text-amber-700">Certificate of Completion</h2>
          </div>

          {/* Main Text */}
          <div className="mb-8 text-lg text-gray-800">
            <p className="mb-4">This is proudly awarded to</p>
            <p className="text-3xl font-bold text-blue-600 mb-6">{preview.student_name}</p>
            <p className="mb-2">For successfully completing the</p>
            <p className="text-2xl font-semibold text-gray-900 mb-6">{preview.course_name}</p>
            <p className="text-lg">with demonstrated excellence and practical programming expertise</p>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-8 px-8 py-6 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-gray-600">FINAL SCORE</p>
              <p className="text-2xl font-bold text-blue-600">{preview.score.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">ATTENDANCE</p>
              <p className="text-2xl font-bold text-green-600">{attendancePercentage.toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">CLASSES</p>
              <p className="text-2xl font-bold text-purple-600">{preview.classes_attended}/{preview.total_classes}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">ISSUED</p>
              <p className="text-xl font-bold text-amber-600">{new Date(preview.issued_date).getFullYear()}</p>
            </div>
          </div>

          {/* Skills Section */}
          {preview.topics_learned && preview.topics_learned.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-600 mb-3">SKILLS & EXPERTISE ACQUIRED</p>
              <div className="flex flex-wrap justify-center gap-2">
                {preview.topics_learned.map((topic, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certificate Number */}
          <div className="text-sm text-gray-600 mb-8">
            Certificate No: <span className="font-mono font-bold">{preview.certificate_number}</span>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-3 gap-8 mt-12 px-8">
            {/* Left - Institute Director */}
            <div className="text-center">
              <div className="border-t-2 border-gray-800 pt-2 mb-2 h-16"></div>
              <p className="font-semibold text-gray-900">Institute Director</p>
              <p className="text-sm text-gray-600">Gopher Lab</p>
            </div>

            {/* Center - Seal/Stamp */}
            <div className="text-center flex flex-col items-center justify-end">
              <div className="w-20 h-20 border-4 border-amber-600 rounded-full flex items-center justify-center mb-2">
                <div className="text-center">
                  <p className="text-xs font-bold text-amber-600">GOPHER</p>
                  <p className="text-xs font-bold text-amber-600">LAB</p>
                  <p className="text-xs font-bold text-amber-600">SEAL</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Certified Teaching Institute</p>
            </div>

            {/* Right - Teacher */}
            <div className="text-center">
              <div className="border-t-2 border-gray-800 pt-2 mb-2 h-16"></div>
              <p className="font-semibold text-gray-900">Your Name</p>
              <p className="text-sm text-gray-600">Senior Backend Engineer</p>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-12 pt-8 border-t-2 border-gray-300 text-sm text-gray-700 italic max-w-2xl mx-auto">
            <p>
              This certificate recognizes the recipient's successful completion of the comprehensive Backend Developer Training program.
              The holder has demonstrated strong practical programming skills, theoretical knowledge, and professional expertise in backend development technologies.
            </p>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Certificate</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => downloadCertificate('pdf')}
            disabled={downloading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            📄 Download as PDF
          </button>
          <button
            onClick={() => downloadCertificate('png')}
            disabled={downloading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            🖼️ Download as PNG
          </button>
          <button
            onClick={() => downloadCertificate('jpeg')}
            disabled={downloading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            📸 Download as JPEG
          </button>
          {downloading && (
            <span className="text-gray-600 self-center ml-4">Generating...</span>
          )}
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Achievement</h3>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 font-medium">
            Share on LinkedIn
          </button>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
            Share on WhatsApp
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Share on Twitter
          </button>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-lg p-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">Certificate Details</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Certificate No:</dt>
              <dd className="font-mono text-gray-900">{preview.certificate_number}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Issued Date:</dt>
              <dd className="text-gray-900">{new Date(preview.issued_date).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Status:</dt>
              <dd className="text-green-600 font-medium">✓ Verified</dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">Program Details</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Program:</dt>
              <dd className="text-gray-900">Backend Developer Training</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Duration:</dt>
              <dd className="text-gray-900">6 Months</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Institute:</dt>
              <dd className="text-gray-900">Gopher Lab</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// Dummy preview component for demo purposes
export function CertificateDemoPreview() {
  const dummyCert = {
    certificate: {
      id: 1,
      student_id: 1,
      course_id: 1,
      title: 'Backend Developer Training',
      issued_date: new Date().toISOString(),
      completion_date: new Date().toISOString(),
      classes_attended: 24,
      total_classes: 24,
      score: 92.5,
      topics_learned: [
        'Go Programming',
        'RESTful APIs',
        'Database Design',
        'Authentication',
        'Docker & Deployment',
        'Microservices',
      ],
      certificate_number: 'GOPHER-1713177600-123456789',
      certificate_url: undefined,
      status: 'issued',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    preview: {
      student_name: 'John Doe',
      course_name: 'Backend Developer Training (6 Months)',
      score: 92.5,
      classes_attended: 24,
      total_classes: 24,
      topics_learned: [
        'Go Programming',
        'RESTful APIs',
        'Database Design',
        'Authentication',
        'Docker & Deployment',
        'Microservices',
      ],
      certificate_number: 'GOPHER-1713177600-123456789',
      issued_date: new Date().toISOString(),
    },
    formats: ['pdf', 'png', 'jpeg'],
  };

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Simulate download
  const handleDemoDownload = async (format: string) => {
    setDownloading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Certificate would be downloaded as ${format.toUpperCase()}`);
    setDownloading(false);
  };

  return (
    <div className="space-y-6">
      {/* Certificate Display Area */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border-8 border-amber-50">
        <div className="bg-gradient-to-b from-amber-50 to-white p-12 text-center min-h-[650px] flex flex-col justify-center">
          {/* Top Decoration */}
          <div className="mb-4">
            <div className="text-5xl font-bold text-amber-600">🏆</div>
          </div>

          {/* Institution Name */}
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Gopher Lab</h1>
          <p className="text-lg text-gray-600 mb-8">Professional Backend Development Training Institute</p>

          {/* Certificate Title */}
          <div className="border-t-4 border-b-4 border-amber-600 py-6 mb-8">
            <h2 className="text-3xl font-bold text-amber-700">Certificate of Completion</h2>
          </div>

          {/* Main Text */}
          <div className="mb-8 text-lg text-gray-800">
            <p className="mb-4">This is proudly awarded to</p>
            <p className="text-3xl font-bold text-blue-600 mb-6">John Doe</p>
            <p className="mb-2">For successfully completing the</p>
            <p className="text-2xl font-semibold text-gray-900 mb-6">Backend Developer Training (6 Months)</p>
            <p className="text-lg">with demonstrated excellence and practical programming expertise in modern backend technologies, demonstrating proficiency across multiple programming paradigms and full-stack development practices</p>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-8 px-8 py-6 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-gray-600">FINAL SCORE</p>
              <p className="text-2xl font-bold text-blue-600">92.5%</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">ATTENDANCE</p>
              <p className="text-2xl font-bold text-green-600">100%</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">CLASSES</p>
              <p className="text-2xl font-bold text-purple-600">24/24</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">ISSUED</p>
              <p className="text-xl font-bold text-amber-600">{new Date().getFullYear()}</p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-600 mb-3">SKILLS & EXPERTISE ACQUIRED</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Go Programming', 'RESTful APIs', 'Database Design', 'Authentication', 'Docker & Deployment', 'Microservices'].map(
                (topic) => (
                  <span
                    key={topic}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {topic}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Certificate Number */}
          <div className="text-sm text-gray-600 mb-8">
            Certificate No: <span className="font-mono font-bold">GOPHER-1713177600-123456789</span>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-3 gap-8 mt-12 px-8">
            {/* Left - Institute Director */}
            <div className="text-center">
              <div className="border-t-2 border-gray-800 pt-2 mb-2 h-16 flex items-end">
                <div className="w-full border-b-2 border-dashed border-gray-300"></div>
              </div>
              <p className="font-semibold text-gray-900">Institute Director</p>
              <p className="text-sm text-gray-600">Gopher Lab</p>
            </div>

            {/* Center - Seal/Stamp */}
            <div className="text-center flex flex-col items-center justify-end">
              <div className="w-20 h-20 border-4 border-amber-600 rounded-full flex items-center justify-center mb-2 relative">
                <div className="text-center">
                  <p className="text-xs font-bold text-amber-600">GOPHER</p>
                  <p className="text-xs font-bold text-amber-600">LAB</p>
                  <p className="text-xs font-bold text-amber-600">SEAL</p>
                </div>
                {/* Decorative star background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="text-4xl">⭐</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-semibold">Certified Teaching Institute</p>
            </div>

            {/* Right - Teacher */}
            <div className="text-center">
              <div className="border-t-2 border-gray-800 pt-2 mb-2 h-16 flex items-end">
                <div className="w-full border-b-2 border-dashed border-gray-300"></div>
              </div>
              <p className="font-semibold text-gray-900">Your Name</p>
              <p className="text-sm text-gray-600">Senior Backend Engineer & Course Mentor</p>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-12 pt-8 border-t-2 border-gray-300 text-sm text-gray-700 italic max-w-2xl mx-auto">
            <p>
              This certificate recognizes the recipient's successful completion of the comprehensive Backend Developer Training program.
              The holder has demonstrated exceptional practical programming skills, strong theoretical knowledge, and professional expertise in modern backend development technologies including Go, distributed systems, and cloud deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Certificate</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleDemoDownload('pdf')}
            disabled={downloading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            📄 Download as PDF
          </button>
          <button
            onClick={() => handleDemoDownload('png')}
            disabled={downloading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            🖼️ Download as PNG
          </button>
          <button
            onClick={() => handleDemoDownload('jpeg')}
            disabled={downloading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            📸 Download as JPEG
          </button>
          {downloading && <span className="text-gray-600 self-center ml-4">Generating...</span>}
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Achievement</h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 font-medium">
            Share on LinkedIn
          </button>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
            Share on WhatsApp
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Share on Twitter
          </button>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-lg p-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">Certificate Details</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Certificate No:</dt>
              <dd className="font-mono text-gray-900">GOPHER-1713177600-123456789</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Issued Date:</dt>
              <dd className="text-gray-900">{new Date().toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Status:</dt>
              <dd className="text-green-600 font-medium">✓ Verified & Authorized</dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">Program Details</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Program:</dt>
              <dd className="text-gray-900">Backend Developer Training</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Duration:</dt>
              <dd className="text-gray-900">6 Months (Intense Curriculum)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Institute:</dt>
              <dd className="text-gray-900">Gopher Lab</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
