"use client";

import { motion } from 'framer-motion';
import { Video, Search, Download, Cloud, Play, Clock } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Features() {
  const features: Feature[] = [
    {
      icon: <Video className="w-12 h-12" />,
      title: 'Easy Video Access',
      description: 'Instantly access all your recorded lectures from any device with our intuitive video player.',
    },
    {
      icon: <Search className="w-12 h-12" />,
      title: 'Smart Search',
      description: 'Find specific lectures quickly with advanced search and filtering by subject, date, or topic.',
    },
    {
      icon: <Download className="w-12 h-12" />,
      title: 'Offline Downloads',
      description: 'Download lectures for offline viewing and study anytime, anywhere without internet.',
    },
    {
      icon: <Cloud className="w-12 h-12" />,
      title: 'Cloud Storage',
      description: 'All your lectures are securely stored in the cloud with automatic backups and sync.',
    },
    {
      icon: <Play className="w-12 h-12" />,
      title: 'Playback Controls',
      description: 'Adjust playback speed, bookmark important moments, and resume where you left off.',
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: '24/7 Availability',
      description: 'Access your recorded lectures anytime, day or night, from anywhere in the world.',
    },
  ];

  return (
    <section id="features" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to access and manage your recorded lectures efficiently.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-2xl p-8 neon-glow hover:shadow-2xl transition-all duration-300"
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                {feature.title}
              </h3>

              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20"
        >
          <div className="glass rounded-3xl p-8 md:p-12 neon-glow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { value: '1000+', label: 'Lectures Available' },
                { value: '24/7', label: 'Access Anytime' },
                { value: '100%', label: 'Cloud Backed' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}