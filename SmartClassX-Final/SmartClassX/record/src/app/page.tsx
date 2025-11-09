"use client";

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import About from '@/components/About';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <ScrollToTop />
       <footer className="py-8 px-4 backdrop-blur-md bg-white/10 dark:bg-black/10 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 SmartClassX. Next-Gen Learning Platform.</p>
        </div>
      </footer>
    </div>
    
  );
}