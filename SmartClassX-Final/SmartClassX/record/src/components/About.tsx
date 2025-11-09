"use client";

import { motion } from 'framer-motion';
import { Cpu, Cloud, Zap, Shield } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            About SmartClassX
          </h2>

          {/* Glowing Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-8 neon-glow"
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-3xl p-8 md:p-12 neon-glow"
        >
          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 text-center">
            SmartClassX is an IoT-enabled smart classroom system designed to automate attendance, 
            store digital materials, and provide lecture access using Raspberry Pi and cloud technologies.
          </p>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { icon: <Cpu className="w-8 h-8" />, label: 'IoT Powered' },
              { icon: <Cloud className="w-8 h-8" />, label: 'Cloud Storage' },
              { icon: <Zap className="w-8 h-8" />, label: 'Fast & Efficient' },
              { icon: <Shield className="w-8 h-8" />, label: 'Secure' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1, rotate: 360 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white neon-glow">
                  {item.icon}
                </div>
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Glowing Line Dividers */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent neon-glow"
        />
      </div>
    </section>
  );
}