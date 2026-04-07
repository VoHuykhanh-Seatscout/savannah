"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { 
  GraduationCap, LogOut, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const brandColors = {
  primary: "#EA580C",
  secondary: "#F97316",
  accent: "#FBBF24",
  dark: "#1F2937",
  light: "#FFFBEB",
};

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 z-50 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left spacer for centering */}
        <div className="w-10 md:w-16"></div>

        {/* Centered Logo - Larger */}
        <Link href="/">
          <motion.div 
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-3"
              style={{
                background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`,
                boxShadow: `0 4px 12px ${brandColors.primary}30`
              }}
            >
              <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(45deg, ${brandColors.primary}, ${brandColors.secondary})`
                }}
              >
                Savannah
              </span>
            </h1>
          </motion.div>
        </Link>

        {/* Right spacer with sign out button if session exists */}
        <div className="w-10 md:w-16 flex justify-end">
          {session && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" style={{ color: brandColors.primary }} />
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button - Only show on mobile */}
        <div className="md:hidden flex items-center">
          <motion.button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg"
            style={{
              backgroundColor: mobileMenuOpen ? brandColors.primary : 'transparent',
              color: mobileMenuOpen ? 'white' : brandColors.primary
            }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 left-0 right-0 bg-white z-40 px-6 py-4 overflow-y-auto"
            style={{
              borderTop: `1px solid ${brandColors.dark}10`,
              boxShadow: `0 8px 24px ${brandColors.dark}10`
            }}
          >
            <div className="flex flex-col space-y-2">
              {session && (
                <>
                  <div className="flex items-center space-x-3 p-3 rounded-lg mb-2"
                    style={{ backgroundColor: `${brandColors.primary}05` }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2"
                      style={{ borderColor: brandColors.primary }}
                    >
                      <Image
                        src={session.user?.image || "/default-avatar.png"}
                        alt="User Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="font-bold" style={{ color: brandColors.dark }}>
                        {session.user?.name}
                      </div>
                      <div className="text-xs opacity-70" style={{ color: brandColors.dark }}>
                        {session.user?.email}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => signOut()}
                    className="flex items-center justify-center px-6 py-3 rounded-xl mt-2 font-medium border"
                    style={{
                      borderColor: brandColors.secondary,
                      color: brandColors.secondary
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </button>
                </>
              )}

              {!session && (
                <>
                  <motion.button
                    onClick={() => router.push("/auth/login")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 text-white font-bold tracking-wider rounded-xl mt-2"
                    style={{
                      background: `linear-gradient(45deg, ${brandColors.primary}, ${brandColors.secondary})`
                    }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => router.push("/auth/register")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 font-bold tracking-wider rounded-xl mt-2 border"
                    style={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary
                    }}
                  >
                    Create Account
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}