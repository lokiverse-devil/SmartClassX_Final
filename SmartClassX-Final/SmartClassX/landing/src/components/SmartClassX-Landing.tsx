"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Users,
  FileText,
  Video,
  Linkedin,
  Github,
  Instagram,
  GraduationCap,
  Wifi,
  Brain,
  Cloud,
} from "lucide-react";






export default function SmartClassXLanding() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: Users,
      title: "Digital Attendance System",
      description:
        "AI-powered attendance marking using face recognition and real-time validation.",
      url: "http://10.16.182.197:3001",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      icon: FileText,
      title: "Document Digitalization",
      description:
        "Digitally scan, organize, and manage study documents instantly.",
      url: "http://10.16.182.197:3002",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      icon: Video,
      title: "Recorded Lectures Access",
      description:
        "Access previous lecture recordings anytime, anywhere with cloud storage integration.",
      url: "http://10.16.182.197:3003",
      gradient: "from-green-400 to-teal-500",
    },
  ];

  const heroCards = [
    {
      icon: Wifi,
      title: "IoT Enabled",
      description: "Seamlessly connect all classroom devices with cutting-edge Internet of Things technology for real-time monitoring and control.",
      gradient: "from-cyan-400 via-blue-500 to-purple-500",
      delay: 0.5,
    },
    {
      icon: Brain,
      title: "AI Powered",
      description: "Leverage artificial intelligence for smart automation, predictive analytics, and personalized learning experiences.",
      gradient: "from-purple-400 via-pink-500 to-red-500",
      delay: 0.7,
    },
    {
      icon: Cloud,
      title: "Cloud Ready",
      description: "Access your data anywhere, anytime with secure cloud storage and synchronization across all platforms.",
      gradient: "from-green-400 via-teal-500 to-cyan-500",
      delay: 0.9,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-colors duration-500">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 dark:bg-cyan-400/30 rounded-full"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* Sticky Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/10 dark:bg-black/10 backdrop-blur-xl border-b border-white/20 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <GraduationCap className="w-8 h-8 text-cyan-500 dark:text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
                SmartClassX
              </span>
            </motion.div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {["home", "about", "features", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-cyan-400 transition-colors capitalize font-medium"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-lg border border-white/30 dark:border-white/10 shadow-lg hover:shadow-xl transition-all"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
              ) : (
                <Moon className="w-6 h-6 text-purple-600 drop-shadow-[0_0_10px_rgba(147,51,234,0.6)]" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text leading-tight">
              Welcome to SmartClassX
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-800 dark:text-white drop-shadow-lg">
              The Future of Smart Learning
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            SmartClassX transforms traditional classrooms into intelligent
            IoT-powered environments — enabling automation, efficiency, and
            digital learning experiences like never before.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection("features")}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-full shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] transition-all duration-300"
          >
            Get Started
          </motion.button>

          {/* Enhanced Floating Glass Cards */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {heroCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: card.delay }}
                whileHover={{ y: -15, scale: 1.05 }}
                className="group relative p-8 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] dark:hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-500"
              >
                {/* Animated gradient background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Glowing icon */}
                <div className="relative z-10 mb-6 flex justify-center">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-[0_0_30px_rgba(147,51,234,0.6)] group-hover:shadow-[0_0_50px_rgba(147,51,234,0.9)] transition-all duration-500`}>
                    <card.icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative z-10 text-2xl font-bold text-gray-800 dark:text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
                  {card.title}
                </h3>

                <p className="relative z-10 text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {card.description}
                </p>

                {/* Decorative elements */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity duration-500`} />
                <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${card.gradient} opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity duration-500`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative py-20 px-4 bg-white/5 dark:bg-black/5 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
              About SmartClassX
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_0_40px_rgba(147,51,234,0.2)] dark:shadow-[0_0_40px_rgba(6,182,212,0.3)]"
            >
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                SmartClassX is an innovative IoT-enabled classroom management
                ecosystem designed to simplify attendance tracking, document
                handling, and lecture recording. It aims to create a smarter,
                faster, and more connected learning experience for students and
                educators alike.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-80 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 dark:from-cyan-400/10 dark:to-purple-500/10 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-3xl"
              />
              <GraduationCap className="w-32 h-32 text-purple-500 dark:text-cyan-400 drop-shadow-[0_0_30px_rgba(147,51,234,0.8)] z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
              Smart Features of SmartClassX
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-3xl mx-auto">
              Explore our powerful modules that redefine the modern classroom
              experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative p-8 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-lg hover:shadow-[0_0_50px_rgba(147,51,234,0.4)] dark:hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.4)]`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.a
                    href={feature.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-block px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all`}
                  >
                    Explore Now
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative py-20 px-4 bg-white/5 dark:bg-black/5 backdrop-blur-sm"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200">
              Have questions? We'd love to hear from you.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_0_40px_rgba(147,51,234,0.2)]"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/20 dark:bg-black/20 backdrop-blur-lg border border-white/30 dark:border-white/10 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-400 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/20 dark:bg-black/20 backdrop-blur-lg border border-white/30 dark:border-white/10 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-400 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-white/20 dark:bg-black/20 backdrop-blur-lg border border-white/30 dark:border-white/10 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-400 transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_50px_rgba(147,51,234,0.8)] transition-all"
              >
                Send Message
              </motion.button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 bg-white/5 dark:bg-black/10 backdrop-blur-lg border-t border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-700 dark:text-gray-300 text-center md:text-left">
              © 2025 SmartClassX — Innovating Classrooms for a Smarter
              Tomorrow.
            </p>

            <div className="flex items-center space-x-6">
              {[
                { Icon: Linkedin, url: "https://www.linkedin.com/in/om-pandey-87b057328/" },
                { Icon: Github, url: "https://github.com/lokiverse-devil  " },
                { Icon: Instagram, url: "#" },
              ].map(({ Icon, url }, index) => (
                <motion.a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-full hover:shadow-[0_0_20px_rgba(147,51,234,0.6)] transition-all"
                >
                  <Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        
      </footer>
    </div>
  );
}