// app/verify/page.tsx
"use client";

import { Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiLoader, FiArrowRight } from "react-icons/fi";
import { GraduationCap } from "lucide-react";

// Savannah brand colors
const savannahColors = {
  primary: "#EA580C",
  secondary: "#F97316",
  accent: "#FBBF24",
  dark: "#1F2937",
  light: "#FFFBEB",
  creative: "#8A2BE2",
  success: "#10B981",
  error: "#EF4444",
};

// Create a separate component that uses useSearchParams
function VerifyContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState("Preparing your learning journey...");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (isVerifying) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isVerifying]);

  useEffect(() => {
    if (status === "authenticated" && !redirecting) {
      setProgress(100);
      setTimeout(() => {
        // Redirect based on user role
        const role = session?.user?.role?.toLowerCase();
        if (role === "teacher") {
          router.replace("/teacher-dashboard");
        } else {
          router.replace("/");
        }
      }, 800);
      return;
    }

    const token = searchParams.get("token");

    if (!token) {
      setMessage("Invalid verification link");
      setError("Missing verification token. Please check your email again.");
      return;
    }

    async function verifyEmail() {
      setIsVerifying(true);
      setProgress(20);
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Verification failed");

        if (data.isVerified) {
          setMessage("Welcome to Savannah!");
          setHasVerified(true);
          setUserRole(data.role);
          setProgress(70);

          // Try to sign in automatically
          const signInResult = await signIn("credentials", {
            email: data.email,
            password: "",
            redirect: false,
          });

          if (signInResult?.error) {
            console.error("Auto-login error:", signInResult.error);
            // If auto-login fails, redirect to login page
            setTimeout(() => {
              router.replace("/login?verified=true");
            }, 1000);
            return;
          }

          setProgress(100);
          setRedirecting(true);
          
          // Wait a moment then redirect based on role
          setTimeout(() => {
            const role = data.role?.toLowerCase();
            if (role === "teacher") {
              router.replace("/teacher-dashboard");
            } else {
              router.replace("/");
            }
          }, 1000);
        } else {
          setMessage("Verification incomplete");
          setError("Please try the verification link again.");
        }
      } catch (err) {
        setMessage("Verification failed");
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsVerifying(false);
      }
    }

    if (!hasVerified && !isVerifying && status !== "authenticated") {
      verifyEmail();
    }
  }, [searchParams, status, router, hasVerified, isVerifying, redirecting, session]);

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden"
      style={{ backgroundColor: savannahColors.light }}
    >
      {/* Background elements */}
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
            Empowering youth through job readiness and financial literacy
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {isVerifying ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-6"
            >
              <h2 className="text-2xl font-bold tracking-tight"
                style={{ color: savannahColors.dark }}
              >
                Verifying Your Email
              </h2>
              <p className="text-sm" style={{ color: savannahColors.dark }}>
                Setting up your learning dashboard...
              </p>
              
              <div className="w-full h-2 rounded-full bg-gray-200 mt-4">
                <motion.div 
                  className="h-full rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: `linear-gradient(90deg, ${savannahColors.primary}, ${savannahColors.secondary})`
                  }}
                />
              </div>
              
              <div className="flex items-center mt-2 text-xs"
                style={{ color: savannahColors.dark }}
              >
                <FiLoader className="animate-spin mr-2" />
                <span>{progress}% complete</span>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-6 text-center"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${savannahColors.error}10` }}
              >
                <FiAlertCircle className="w-10 h-10" 
                  style={{ color: savannahColors.error }} 
                />
              </div>
              <h2 className="text-2xl font-bold tracking-tight"
                style={{ color: savannahColors.dark }}
              >
                Verification Issue
              </h2>
              <p className="text-sm px-4" style={{ color: savannahColors.dark }}>
                {message}
              </p>
              <p className="text-sm px-4 mt-2" 
                style={{ color: savannahColors.error }}
              >
                {error}
              </p>
              <button 
                className="mt-4 px-6 py-2 rounded-xl text-sm font-bold tracking-tight flex items-center"
                style={{
                  backgroundColor: savannahColors.primary,
                  color: 'white',
                  boxShadow: `0 4px 14px ${savannahColors.primary}40`
                }}
                onClick={() => window.location.reload()}
              >
                Try Again <FiArrowRight className="ml-2" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-6 text-center"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${savannahColors.success}10` }}
              >
                <FiCheckCircle className="w-10 h-10" 
                  style={{ color: savannahColors.success }} 
                />
              </div>
              <h2 className="text-2xl font-bold tracking-tight"
                style={{ color: savannahColors.dark }}
              >
                {hasVerified ? "Ready to Learn!" : "Almost There!"}
              </h2>
              <p className="text-sm px-4" style={{ color: savannahColors.dark }}>
                {message}
              </p>
              
              {hasVerified && (
                <div
                  className="mt-4 flex items-center text-sm"
                  style={{ color: savannahColors.dark }}
                >
                  <FiLoader className="animate-spin mr-2" />
                  <span>Preparing your dashboard...</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          className="mt-8 pt-6 border-t text-center text-xs"
          style={{
            borderColor: `${savannahColors.dark}10`,
            color: savannahColors.dark
          }}
        >
          <p>Building future-ready skills for success</p>
          <p className="mt-1">© {new Date().getFullYear()} Savannah - All rights reserved</p>
        </div>
      </motion.div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: savannahColors.light }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}