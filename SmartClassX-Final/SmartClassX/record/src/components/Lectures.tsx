"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, BookOpen, Play } from "lucide-react";

interface Lecture {
  id: number;
  title: string;
  subject: string;
  date: string;
  videoUrl: string;
}

export default function Lectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://10.16.182.197:5002/api/lectures")
      .then((res) => res.json())
      .then((data) => {
        setLectures(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading lectures:", error);
        setLoading(false);
      });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Loading Lectures...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Recorded Lectures
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Relive every classroom moment — stream SmartClassX lectures anytime,
            anywhere, with cinematic clarity.
          </p>
        </motion.div>

        {/* Lecture Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {lectures.map((lecture) => (
            <motion.div
              key={lecture.id}
              variants={item}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="glass rounded-2xl p-6 neon-glow hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 overflow-hidden group-hover:neon-glow">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-16 h-16 text-purple-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground group-hover:text-purple-500 transition-colors">
                  {lecture.title}
                </h3>

                <div className="flex items-center space-x-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">{lecture.subject}</span>
                </div>

                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(lecture.date).toLocaleDateString()}
                  </span>
                </div>

                {/* Watch Button */}
                <button
                  onClick={() =>
                    setSelectedLecture(
                      selectedLecture === lecture.id ? null : lecture.id
                    )
                  }
                  className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  {selectedLecture === lecture.id
                    ? "Hide Lecture"
                    : "Watch Lecture"}
                </button>

                {/* 🎥 Cinematic Fade-in Player */}
                <AnimatePresence>
                  {selectedLecture === lecture.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="relative mt-4 aspect-video rounded-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-400/10 to-transparent backdrop-blur-lg rounded-xl"></div>

                      {/* ✅ HTML5 Video Player */}
                      <video
                        controls
                        preload="metadata"
                        className="relative z-10 w-full h-full rounded-xl shadow-2xl"
                      >
                        <source src={lecture.videoUrl} type="video/mp4" />
                        Your browser does not support HTML5 video.
                      </video>

                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-2xl rounded-xl"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}