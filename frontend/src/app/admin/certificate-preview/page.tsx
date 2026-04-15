'use client';

import { useState } from 'react';

interface CertificateFormData {
  studentName: string;
  score: number;
  classesAttended: number;
  totalClasses: number;
  topicsLearned: string;
}

export default function CertificatePreviewPage() {
  const [formData, setFormData] = useState<CertificateFormData>({
    studentName: 'Vikash Parashar',
    score: 92.5,
    classesAttended: 23,
    totalClasses: 24,
    topicsLearned: 'Go Programming • REST APIs • Database Design • Docker • Kubernetes',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'score' || name === 'classesAttended' || name === 'totalClasses' 
        ? parseFloat(value) 
        : value,
    }));
  };

  const generateCertificateNumber = () => {
    return `GOPHER-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  };

  const getIssueDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📜 Certificate Preview</h1>
        <p className="text-gray-600 mb-8">Customize and see how your certificate will look</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Certificate Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter student name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Final Score (%)</label>
                  <input
                    type="number"
                    name="score"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Rate</label>
                  <div className="px-4 py-2 bg-gray-100 rounded-lg text-center font-medium">
                    {Math.round((formData.classesAttended / formData.totalClasses) * 100)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Classes Attended</label>
                  <input
                    type="number"
                    name="classesAttended"
                    value={formData.classesAttended}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Classes</label>
                  <input
                    type="number"
                    name="totalClasses"
                    value={formData.totalClasses}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills Learned (comma-separated)</label>
                <textarea
                  name="topicsLearned"
                  value={formData.topicsLearned}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Go Programming • REST APIs • Database Design"
                />
              </div>

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition">
                ✓ Customize Form
              </button>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="lg:col-span-2">
            <div className="flex justify-center">
              {/* A4 Landscape Certificate */}
              <div
                className="bg-yellow-50 shadow-2xl p-0 overflow-hidden"
                style={{ width: '1188px', height: '840px', aspectRatio: '297/210' }}
              >
                {/* Outer Border */}
                <div className="h-full border-4" style={{ borderColor: '#B8860B' }}>
                  {/* Inner Border */}
                  <div className="h-full border" style={{ borderColor: '#DAA520', margin: '8px' }}>
                    <div className="h-full p-6 flex flex-col justify-between" style={{ padding: '40px' }}>
                      {/* Header Section */}
                      <div className="text-center border-b-2" style={{ borderColor: '#B8860B', paddingBottom: '20px' }}>
                        <h1 className="text-4xl font-bold mb-2" style={{ color: '#003366' }}>
                          Gopher Lab
                        </h1>
                        <p className="text-sm italic text-gray-600 mb-3">
                          Empowering Developers with Modern Programming Excellence
                        </p>
                        <h2 className="text-3xl font-bold" style={{ color: '#B8860B' }}>
                          Certificate of Completion
                        </h2>
                      </div>

                      {/* Main Content */}
                      <div className="text-center space-y-3 flex-grow flex flex-col justify-center">
                        <p className="text-base text-gray-800">This is to certify that</p>
                        <h3 className="text-3xl font-bold" style={{ color: '#003366' }}>
                          {formData.studentName}
                        </h3>
                        <p className="text-base text-gray-800">
                          has successfully completed the <span className="font-semibold">Backend Developer Training Program</span>
                        </p>
                        <p className="text-base text-gray-800">with a duration of <span className="font-semibold">6 Months</span></p>

                        {/* Performance Details */}
                        <div className="flex justify-center gap-12 mt-6 pt-6 border-t border-gray-300">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-700">Final Score</p>
                            <p className="text-2xl font-bold" style={{ color: '#003366' }}>
                              {formData.score}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-700">Attendance</p>
                            <p className="text-2xl font-bold" style={{ color: '#003366' }}>
                              {formData.classesAttended}/{formData.totalClasses}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-700">Attendance Rate</p>
                            <p className="text-2xl font-bold" style={{ color: '#003366' }}>
                              {Math.round((formData.classesAttended / formData.totalClasses) * 100)}%
                            </p>
                          </div>
                        </div>

                        {/* Skills Acquired */}
                        <div className="mt-6 pt-4 border-t border-gray-300">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Skills Acquired</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {formData.topicsLearned}
                          </p>
                        </div>
                      </div>

                      {/* Footer Section */}
                      <div className="border-t-2 pt-4" style={{ borderColor: '#B8860B' }}>
                        {/* Certificate Number and Date */}
                        <p className="text-xs text-gray-500 text-center mb-4">
                          Certificate No: {generateCertificateNumber()} | Date: {getIssueDate()}
                        </p>

                        {/* Signature Section */}
                        <div className="flex justify-between items-end">
                          {/* Left - Director */}
                          <div className="text-center flex-1">
                            <p className="text-xs font-bold border-t-2 border-gray-800 pt-1 mb-1" style={{ marginRight: '20px' }}>
                              _______________
                            </p>
                            <p className="text-xs font-semibold text-gray-800">Institute Director</p>
                            <p className="text-xs text-gray-700">Gopher Lab</p>
                          </div>

                          {/* Center - Seal */}
                          <div className="text-center flex-1">
                            <div
                              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-1"
                              style={{ backgroundColor: '#DAA52033', border: '2px solid #B8860B' }}
                            >
                              <span className="text-sm font-bold text-center" style={{ color: '#B8860B' }}>
                                GOPHER<br />
                                LAB
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">Certified Institute</p>
                          </div>

                          {/* Right - Teacher */}
                          <div className="text-center flex-1">
                            <p className="text-xs font-bold border-t-2 border-gray-800 pt-1 mb-1" style={{ marginLeft: '20px' }}>
                              _______________
                            </p>
                            <p className="text-xs font-semibold text-gray-800">Course Instructor</p>
                            <p className="text-xs text-gray-700">Backend Training</p>
                          </div>
                        </div>

                        {/* Footer Text */}
                        <p className="text-xs text-gray-500 text-center mt-3 italic leading-tight">
                          This certificate is awarded in recognition of successfully completing Backend Developer Training with demonstrated expertise and practical programming skills.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Certificate Features</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Professional Design</p>
                    <p className="text-gray-600">Gold borders with Gopher Lab branding</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Student Details</p>
                    <p className="text-gray-600">Name, score, and attendance metrics</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Skills Section</p>
                    <p className="text-gray-600">Display of learned topics/skills</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Digital Seal</p>
                    <p className="text-gray-600">Official Gopher Lab certification mark</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Signature Lines</p>
                    <p className="text-gray-600">Director, Seal, and Instructor signatures</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Unique Number</p>
                    <p className="text-gray-600">Each certificate gets a unique identifier</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-medium">💡 Tip: Edit the form on the left to see how different student details appear on the certificate!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
