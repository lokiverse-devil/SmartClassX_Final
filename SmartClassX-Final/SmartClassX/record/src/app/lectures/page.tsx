"use client";

import Navbar from '@/components/Navbar';
import Lectures from '@/components/Lectures';
import ScrollToTop from '@/components/ScrollToTop';

export default function LecturesPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Lectures />
      <ScrollToTop />
    </div>
  );
}
