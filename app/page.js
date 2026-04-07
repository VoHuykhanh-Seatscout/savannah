"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from '@/components/Navbar';
import { ChevronRight, LogOut, Clock, Award } from "lucide-react";

// Savannah brand colors
const savannahColors = {
  primary: "#EA580C",
  secondary: "#F97316",
  accent: "#FBBF24",
  dark: "#1F2937",
  light: "#FFFBEB",
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: savannahColors.light }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  // 8 Courses - Make sure these IDs match your courseData.ts exactly
  const courses = [
    {
      id: "financial-literacy",  // Must match the ID in courseData
      title: "Financial Literacy",
      description: "Learn how to manage money, save, and invest wisely for a secure financial future.",
      icon: "💰",
      duration: "2 hours",
      color: "#EA580C",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      id: "bookkeeping",  // Must match the ID in courseData
      title: "Bookkeeping",
      description: "Master the basics of recording and managing financial transactions professionally.",
      icon: "📊",
      duration: "2.5 hours",
      color: "#F97316",
      gradient: "from-orange-400 to-orange-500"
    },
    {
      id: "budgeting",  // Must match the ID in courseData
      title: "Budgeting",
      description: "Learn how to create and manage budgets effectively.",
      icon: "📋",
      duration: "2 hours",
      color: "#FBBF24",
      gradient: "from-amber-400 to-amber-500"
    },
    {
      id: "cv-basics",  // Must match the ID in courseData
      title: "CV Basics",
      description: "Create professional CVs that get noticed by employers.",
      icon: "📝",
      duration: "2 hours",
      color: "#EA580C",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      id: "cover-letter",  // Must match the ID in courseData
      title: "Cover Letter",
      description: "Write compelling cover letters that stand out.",
      icon: "✉️",
      duration: "1.5 hours",
      color: "#F97316",
      gradient: "from-orange-400 to-orange-500"
    },
    {
      id: "professional-email",  // Must match the ID in courseData
      title: "Professional Email",
      description: "Master the art of professional email communication.",
      icon: "📧",
      duration: "2 hours",
      color: "#FBBF24",
      gradient: "from-amber-400 to-amber-500"
    },
    {
      id: "digital-literacy-1",  // Must match the ID in courseData
      title: "Digital Literacy Part 1",
      description: "Master essential digital skills for the modern workplace.",
      icon: "💻",
      duration: "2 hours",
      color: "#EA580C",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      id: "digital-literacy-2",  // Must match the ID in courseData
      title: "Digital Literacy Part 2",
      description: "Advanced digital skills and online professionalism.",
      icon: "🖥️",
      duration: "2.5 hours",
      color: "#F97316",
      gradient: "from-orange-400 to-orange-500"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              <span className="text-gray-900">Welcome back, </span>
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {session?.user?.name?.split(' ')[0] || 'Student'}
              </span>
            </h1>
            <p className="text-gray-600 text-2xl">
              Continue your learning journey to career success
            </p>
          </motion.div>

          {/* Sign Out Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6"
          >
            <button
              onClick={() => signOut()}
              className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 mx-auto"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </motion.div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Available Courses</h2>
            <p className="text-gray-600">Choose a course to start learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={`/courses/${course.id}`} className="block h-full">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full cursor-pointer">
                    {/* Top color bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${course.gradient}`}></div>
                    
                    <div className="p-6">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center text-2xl shadow-md mb-4`}>
                        {course.icon}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold mb-2 text-gray-900">
                        {course.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {course.description}
                      </p>
                      
                      {/* Duration only */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                      </div>
                      
                      {/* Start Button */}
                      <div
                        className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r ${course.gradient} text-white hover:shadow-md`}
                      >
                        Start Learning <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-4 bg-gradient-to-r from-orange-500 to-orange-600 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Transform Your Career?
            </h2>
            <p className="text-orange-100 mb-4">
              Complete all courses and earn your certificate
            </p>
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <Award className="w-4 h-4" />
              <span>Get certified upon completion</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Savannah Program. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}