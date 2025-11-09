"use client"

import Navigation from '@/components/Navigation';
import { useState } from 'react';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';

export default function TeacherPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate upload
    setShowSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSelectedFile(null);
      setSubject('');
      setDescription('');
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Teacher Portal
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Upload study materials for your students
            </p>
          </div>

          {/* Upload Form */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            
            <div className="relative backdrop-blur-xl bg-white/40 dark:bg-black/40 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/50 dark:bg-black/50 border border-white/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g., Mathematics, Physics, Chemistry..."
                    required
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/50 dark:bg-black/50 border border-white/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Brief description of the material..."
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Upload File
                  </label>
                  
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-48 rounded-xl backdrop-blur-md bg-white/30 dark:bg-black/30 border-2 border-dashed border-blue-400 hover:border-blue-500 cursor-pointer transition-all group/upload"
                    >
                      {selectedFile ? (
                        <div className="flex flex-col items-center space-y-3">
                          <FileText className="w-16 h-16 text-blue-600 animate-bounce" />
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-3">
                          <Upload className="w-16 h-16 text-blue-500 group-hover/upload:scale-110 transition-transform" />
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            PDF, DOC, DOCX, PPT, PPTX (Max 50MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Material</span>
                </button>
              </form>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Recent Uploads
            </h2>
            
            <div className="space-y-4">
              {[
                { subject: 'CHS', title: 'Practical 7', date: '3 days ago' },
                { subject: 'CHS', title: 'Practical 8', date: '2 days ago' },
                { subject: 'CHS', title: 'Practical 9', date: '1 day ago' },
                { subject: 'CHS', title: 'Practical 10', date: '2 hour ago' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-white/30 dark:bg-black/30 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.subject} • {item.date}
                        </p>
                      </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/50 backdrop-blur-sm">
          <div className="relative animate-bounce">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur-xl opacity-75"></div>
            <div className="relative backdrop-blur-xl bg-white/90 dark:bg-black/90 rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Upload Successful!
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Your study material has been uploaded and is now available to students.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}