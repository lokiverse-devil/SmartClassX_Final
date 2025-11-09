"use client"

import Navigation from '@/components/Navigation';
import { Download, FileText, BookOpen, Search } from 'lucide-react';
import { useState } from 'react';

const studyMaterials = [
  {
    id: 1,
    title: 'PRACTICAL 7',
    subject: 'Computer Hardware and Servicing',
    teacher: 'XYZ',
    date: '2024-01-15',
    size: '2.5 MB',
    file: '/CHS Practical 7.pdf',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'PRACTICAL 8',
    subject: 'Computer Hardware and Servicing',
    teacher: 'XYZ',
    date: '2024-01-14',
    size: '3.2 MB',
    file: '/CHS Practicals 8.pdf',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    title: 'PRACTICAL 9',
    subject: 'Computer Hardware and Servicing',
    teacher: 'XYZ',
    date: '2024-01-13',
    size: '4.1 MB',
    file: '/CHS Practicals 9.pdf',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    title: 'PRACTICAL 10 A,B',
    subject: 'Computer Hardware and Servicing',
    teacher: 'XYZ',
    date: '2024-01-12',
    size: '5.8 MB',
    file: '/CHS Practical 10 a,b.pdf',
    color: 'from-orange-500 to-red-500'
  },
  
];

export default function StudentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const filteredMaterials = studyMaterials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (material: typeof studyMaterials[0]) => {
    setDownloadingId(material.id);
    
    // Simulate download
    setTimeout(() => {
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = material.file;
      link.download = `${material.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadingId(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Student Portal
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Access and download study materials
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative backdrop-blur-xl bg-white/40 dark:bg-black/40 rounded-2xl p-2 border border-white/20">
                <div className="flex items-center space-x-3 px-4">
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by subject or title..."
                    className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${material.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                
                <div className="relative backdrop-blur-xl bg-white/40 dark:bg-black/40 rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all transform hover:scale-105 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${material.color} rounded-xl flex items-center justify-center mb-4`}>
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {material.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <p className="flex items-center space-x-2">
                        <span className="font-semibold">Subject:</span>
                        <span>{material.subject}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="font-semibold">Teacher:</span>
                        <span>{material.teacher}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="font-semibold">Size:</span>
                        <span>{material.size}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="font-semibold">Date:</span>
                        <span>{material.date}</span>
                      </p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(material)}
                    disabled={downloadingId === material.id}
                    className={`w-full py-3 bg-gradient-to-r ${material.color} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 ${
                      downloadingId === material.id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                  >
                    {downloadingId === material.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No materials found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}