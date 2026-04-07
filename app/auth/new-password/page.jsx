// app/auth/new-password/page.jsx
"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, GraduationCap, Eye, EyeOff } from "lucide-react";

const savannahColors = {
  primary: "#EA580C",
  secondary: "#F97316",
  accent: "#FBBF24",
  dark: "#1F2937",
  light: "#FFFBEB",
  success: "#10B981",
  error: "#EF4444",
};

function NewPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/reset-password/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: savannahColors.light }}>
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-4">The reset link is invalid or has expired.</p>
          <button
            onClick={() => router.push("/auth/reset-password")}
            className="text-orange-500 hover:text-orange-600"
          >
            Request a new reset link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden"
      style={{ backgroundColor: savannahColors.light }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:60px_60px] opacity-5"></div>
      </div>

      <div 
        className="absolute -bottom-60 -right-60 w-[800px] h-[800px] rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: savannahColors.primary }}
      />
      <div 
        className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: savannahColors.secondary }}
      />

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
              <span className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(45deg, ${savannahColors.primary}, ${savannahColors.secondary})`
                }}
              >
                Savannah
              </span>
            </h1>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Password</h2>
          <p className="text-gray-600 text-sm mt-2">Enter your new password below</p>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg text-center text-sm"
            style={{
              backgroundColor: `${savannahColors.success}10`,
              color: savannahColors.success,
              border: `1px solid ${savannahColors.success}20`
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg text-center text-sm"
            style={{
              backgroundColor: `${savannahColors.error}10`,
              color: savannahColors.error,
              border: `1px solid ${savannahColors.error}20`
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: savannahColors.dark }}>
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: savannahColors.primary }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${savannahColors.dark}15`,
                  color: savannahColors.dark,
                }}
                onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: savannahColors.dark }}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: savannahColors.primary }} />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${savannahColors.dark}15`,
                  color: savannahColors.dark,
                }}
                onFocus={(e) => e.target.style.borderColor = savannahColors.primary}
                onBlur={(e) => e.target.style.borderColor = `${savannahColors.dark}15`}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{
              background: `linear-gradient(45deg, ${savannahColors.primary}, ${savannahColors.secondary})`,
              boxShadow: `0 4px 14px ${savannahColors.primary}40`,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-sm flex items-center justify-center gap-1 mx-auto"
            style={{ color: savannahColors.primary }}
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: savannahColors.light }}>
        <div className="text-center">Loading...</div>
      </div>
    }>
      <NewPasswordForm />
    </Suspense>
  );
}