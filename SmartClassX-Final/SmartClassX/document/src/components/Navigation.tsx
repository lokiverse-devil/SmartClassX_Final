"use client"

import Link from 'next/link';
import { useState } from 'react';
import { GraduationCap, User, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartClassX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/teacher"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Teacher</span>
              </span>
            </Link>
            <Link
              href="/student"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/teacher"
              className="block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              onClick={() => setIsOpen(false)}
            >
              Teacher Portal
            </Link>
            <Link
              href="/student"
              className="block px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white"
              onClick={() => setIsOpen(false)}
            >
              Student Portal
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}