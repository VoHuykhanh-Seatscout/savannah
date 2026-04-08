// app/signup/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { GraduationCap, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

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

interface FormData {
  name: string;
  email: string;
  organization: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    organization: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default to student
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "emailVerified" && event.newValue === "true") {
        console.log("✅ Email verified detected via storage event.");
        setVerified(true);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    setPasswordsMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const validatePassword = (password: string): boolean => {
    // Simple validation: just check if password is at least 4 characters
    return password.length >= 4;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { name, email, organization, password, confirmPassword, role } = formData;

    if (!name || !email || !organization || !password || !confirmPassword || !role) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 4 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organization, password, role }),
      });

      const data = await res.json();
      if (res.status === 409) throw new Error("Email already in use. Please log in.");
      if (!res.ok) throw new Error(data.error || "Signup failed. Please try again.");

      setSuccess("✅ Signup successful! Check your email for verification.");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden py-12"
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

        {!verified && success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-lg text-center text-sm"
            style={{
              backgroundColor: `${savannahColors.success}10`,
              color: savannahColors.success,
              border: `1px solid ${savannahColors.success}20`
            }}
          >
            {success}
          </motion.div>
        )}

        {verified && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-lg text-center text-sm"
            style={{
              backgroundColor: `${savannahColors.success}10`,
              color: savannahColors.success,
              border: `1px solid ${savannahColors.success}20`
            }}
          >
            🎉 Your email is verified! Please log in.
          </motion.div>
        )}

        {!verified && (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                  style={{ color: savannahColors.dark }}
                >
                  Full Name
                </label>
                <motion.div whileHover={{ y: -1 }}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'white',
                      border: `1px solid ${savannahColors.dark}15`,
                      color: savannahColors.dark,
                    }}
                    onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                    onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
                    disabled={loading}
                  />
                </motion.div>
              </div>

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
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'white',
                      border: `1px solid ${savannahColors.dark}15`,
                      color: savannahColors.dark,
                    }}
                    onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                    onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
                    disabled={loading}
                  />
                </motion.div>
              </div>

              <div>
                <label 
                  htmlFor="organization" 
                  className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                  style={{ color: savannahColors.dark }}
                >
                  Organization / Institution
                </label>
                <motion.div whileHover={{ y: -1 }} className="relative">
                  <Building2 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                    style={{ color: savannahColors.primary }} 
                  />
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                    placeholder="e.g., University, School, Company"
                    className="w-full pl-10 pr-4 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'white',
                      border: `1px solid ${savannahColors.dark}15`,
                      color: savannahColors.dark,
                    }}
                    onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                    onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
                    disabled={loading}
                  />
                </motion.div>
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                  style={{ color: savannahColors.dark }}
                >
                  Password
                </label>
                <motion.div whileHover={{ y: -1 }} className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'white',
                      border: `1px solid ${savannahColors.dark}15`,
                      color: savannahColors.dark,
                    }}
                    onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                    onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
                    disabled={loading}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                    whileHover={{ scale: 1.1 }}
                    style={{ color: savannahColors.dark }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </motion.button>
                </motion.div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 4 characters
                </p>
              </div>

              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                  style={{ color: savannahColors.dark }}
                >
                  Confirm Password
                </label>
                <motion.div whileHover={{ y: -1 }} className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'white',
                      border: `1px solid ${savannahColors.dark}15`,
                      color: savannahColors.dark,
                    }}
                    onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                    onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
                    disabled={loading}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3"
                    whileHover={{ scale: 1.1 }}
                    style={{ color: savannahColors.dark }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </motion.button>
                </motion.div>
                {formData.confirmPassword && (
                  <div className="flex items-center mt-1">
                    {passwordsMatch ? (
                      <FaCheckCircle className="text-green-500 mr-1" />
                    ) : (
                      <FaTimesCircle className="text-red-500 mr-1" />
                    )}
                    <span className={`text-xs font-medium ${passwordsMatch ? "text-green-500" : "text-red-500"}`}>
                      {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>

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
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'white',
                      border: `1px solid ${savannahColors.dark}15`,
                      color: savannahColors.dark,
                    }}
                    onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                    onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
                    disabled={loading}
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mr-2 rounded"
                  style={{
                    backgroundColor: 'white',
                    border: `1px solid ${savannahColors.dark}15`,
                  }}
                />
                <span className="text-xs" style={{ color: savannahColors.dark }}>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/terms")}
                    className="font-semibold"
                    style={{ color: savannahColors.primary }}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/privacy")}
                    className="font-semibold"
                    style={{ color: savannahColors.primary }}
                  >
                    Privacy Policy
                  </button>
                </span>
              </div>

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
                  <span>Create {formData.role === 'teacher' ? 'Teacher' : 'Student'} Account</span>
                )}
              </motion.button>
            </form>

            <motion.p 
              className="mt-6 text-center text-sm"
              style={{ color: savannahColors.dark }}
            >
              Already have an account?{' '}
              <motion.button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold"
                whileHover={{ x: 2 }}
                style={{ color: savannahColors.primary }}
              >
                Sign in here
              </motion.button>
            </motion.p>
          </>
        )}
      </motion.div>
    </div>
  );
}