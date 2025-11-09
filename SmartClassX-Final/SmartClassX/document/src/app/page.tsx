"use client"

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { GraduationCap, Upload, Download, BookOpen, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-pulse">
                Next-Gen Learning Platform
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Welcome to SmartClassX
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              A futuristic classroom experience where teachers share knowledge 
              and students access learning materials seamlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                href="/teacher"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Teacher Portal</span>
                </span>
              </Link>
              
              <Link
                href="/student"
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Student Portal</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative backdrop-blur-xl bg-white/30 dark:bg-black/30 rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Easy Upload</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Teachers can upload study materials, PDFs, and resources with a simple drag-and-drop interface.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative backdrop-blur-xl bg-white/30 dark:bg-black/30 rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Quick Access</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Students can browse and download learning materials instantly from anywhere, anytime.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-blue-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative backdrop-blur-xl bg-white/30 dark:bg-black/30 rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Organized Library</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All materials are organized by subject and category for easy navigation and discovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 border border-white/20">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    100%
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Digital</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-8 h-8 text-yellow-500" />
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Fast
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Lightning Speed</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <GraduationCap className="w-8 h-8 text-yellow-500" />
                  <div className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                    SmartX
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Intelligent System</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 backdrop-blur-md bg-white/10 dark:bg-black/10 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 SmartClassX. Next-Gen Learning Platform.</p>
        </div>
      </footer>
    </div>
  );
}