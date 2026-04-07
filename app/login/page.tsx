"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

// Savannah brand colors
const savannahColors = {
  primary: "#EA580C",     // Warm orange
  secondary: "#F97316",   // Bright orange
  accent: "#FBBF24",      // Amber yellow
  dark: "#1F2937",        // Dark slate
  light: "#FFFBEB",       // Warm cream
  creative: "#8A2BE2",
  success: "#10B981",     // Emerald green
  error: "#EF4444",       // Red
};

export default function SavannahLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const result = await signIn("credentials", {
        email,
        password,
        role: role.toUpperCase(),
        redirect: false,
        callbackUrl: role === "teacher" ? "/teacher-dashboard" : "/"
      });
  
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(result?.url || "/");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden"
      style={{ backgroundColor: savannahColors.light }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:60px_60px] opacity-5"></div>
      </div>

      {/* Gradient background elements */}
      <div 
        className="absolute -bottom-60 -right-60 w-[800px] h-[800px] rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: savannahColors.primary }}
      />
      <div 
        className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: savannahColors.secondary }}
      />

      {/* Form Container */}
      <motion.div
        className="w-full max-w-md p-8 rounded-2xl relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: `1px solid ${savannahColors.dark}10`,
          boxShadow: `0 12px 40px ${savannahColors.dark}10`,
        }}
      >
        {/* Savannah Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3"
              style={{
                background: `linear-gradient(135deg, ${savannahColors.primary}, ${savannahColors.secondary})`,
                boxShadow: `0 4px 12px ${savannahColors.primary}30`
              }}
            >
              <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(45deg, ${savannahColors.primary}, ${savannahColors.secondary})`
                }}
              >
                Savannah
              </span>
            </h1>
          </div>
          <motion.p 
            className="text-center text-sm"
            style={{ color: savannahColors.dark }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Empowering youth through training and education
          </motion.p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-lg text-center text-sm"
            style={{
              backgroundColor: `${savannahColors.error}10`,
              color: savannahColors.error,
              border: `1px solid ${savannahColors.error}20`
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: savannahColors.dark }}
            >
              Email Address
            </label>
            <motion.div whileHover={{ y: -1 }}>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${savannahColors.dark}15`,
                  color: savannahColors.dark,
                }}
                onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
              />
            </motion.div>
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: savannahColors.dark }}
            >
              Password
            </label>
            <motion.div whileHover={{ y: -1 }}>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${savannahColors.dark}15`,
                  color: savannahColors.dark,
                }}
                onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
              />
            </motion.div>
            <motion.button
              type="button"
              onClick={() => router.push("/auth/reset-password")}
              className="text-xs mt-2"
              whileHover={{ x: 2 }}
              style={{ color: savannahColors.primary }}
            >
              Forgot Password?
            </motion.button>
          </div>

          {/* Role Selector */}
          <div>
            <label 
              htmlFor="role" 
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: savannahColors.dark }}
            >
              I am a
            </label>
            <motion.div whileHover={{ y: -1 }} className="relative">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${savannahColors.dark}15`,
                  color: savannahColors.dark,
                }}
                onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher / Mentor</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            className="w-full p-3 rounded-xl text-sm font-bold tracking-tight relative overflow-hidden"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: `linear-gradient(45deg, ${savannahColors.primary}, ${savannahColors.secondary})`,
              color: 'white',
              boxShadow: `0 4px 14px ${savannahColors.primary}40`
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              </div>
            ) : (
              <span>Continue as {role === 'teacher' ? 'Teacher' : 'Student'}</span>
            )}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <motion.p 
          className="mt-8 text-center text-sm"
          style={{ color: savannahColors.dark }}
        >
          New to Savannah?{' '}
          <motion.button
            type="button"
            onClick={() => router.push("/signup")}
            className="font-semibold"
            whileHover={{ x: 2 }}
            style={{ color: savannahColors.primary }}
          >
            Create an account
          </motion.button>
        </motion.p>

        {/* Stats */}
        <motion.div 
          className="mt-8 text-center text-xs"
          style={{ color: savannahColors.dark }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Join <span className="font-bold" style={{ color: savannahColors.primary }}>1,000+ students</span> building their future</p>
        </motion.div>
      </motion.div>
    </div>
  );
}