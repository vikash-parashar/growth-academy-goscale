'use client';

import { CertificateDemoPreview } from '@/components/certificate-preview-renderer';

export default function CertificateDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Certificate Preview Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This is how your professional certificate will look. It includes Gopher Lab branding, 
            student achievements, teacher signature, and the official seal. You can download it as PDF, PNG, or JPEG.
          </p>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-3xl mb-3">🏫</div>
            <h3 className="font-semibold text-gray-900 mb-2">Institution Branding</h3>
            <p className="text-sm text-gray-600">
              Features "Gopher Lab" branding as the certified teaching institute with professional design
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-semibold text-gray-900 mb-2">Official Seal & Stamp</h3>
            <p className="text-sm text-gray-600">
              Includes the Gopher Lab seal and your name as the authorized mentor/teacher
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Achievement Details</h3>
            <p className="text-sm text-gray-600">
              Shows scores, attendance, acquired skills, and all course completion metrics
            </p>
          </div>
        </div>

        {/* Feature List */}
        <div className="bg-blue-50 rounded-lg p-8 mb-12 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Certificate Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">Professional 6-month Backend Developer Training credential</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">Student name, score (92.5%), attendance (24/24), and date issued</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">Lists all skills acquired (Go, APIs, Databases, Docker, Microservices)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">Your signature as Senior Backend Engineer and Course Mentor</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">Official Gopher Lab seal confirming it's from certified institute</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">Download as PDF, PNG, or JPEG with unique certificate number</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">Share on LinkedIn, WhatsApp, Twitter directly from portal</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-700">Professional design with gold accents and official seal</span>
            </div>
          </div>
        </div>

        {/* Main Certificate Preview */}
        <div className="mb-12">
          <CertificateDemoPreview />
        </div>

        {/* Instructions */}
        <div className="bg-green-50 rounded-lg p-8 border border-green-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How to Use</h2>
          <ol className="space-y-3 text-gray-700 list-decimal list-inside">
            <li>Students can view their earned certificates in the "My Certificates" tab of their dashboard</li>
            <li>Admin can review and approve pending certificates from the admin dashboard</li>
            <li>Once approved, students receive the digital certificate with their name and achievements</li>
            <li>Students can download the certificate in any format (PDF, PNG, JPEG) with a single click</li>
            <li>Share buttons allow direct sharing to social media to showcase achievements</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
