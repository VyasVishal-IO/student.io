'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { motion } from 'framer-motion';
import LoginButton from '@/components/auth/LoginButton';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LoginPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visibility for animations
    setIsVisible(true);

    // Handle redirection based on auth state
    if (!loading) {
      setIsRedirecting(true);

      const timer = setTimeout(() => {
        if (user) {
          if (!profile?.role) {
            router.push('/role-selection');
          } else if (profile.role && profile.username) {
            router.push(`/home/${profile.role}/${profile.username}`);
          }
        }
        setIsRedirecting(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user, profile, loading, router]);

  if (loading || isRedirecting) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>StudentLab - AI-Powered Learning Platform</title>
        <meta name="description" content="Expand your knowledge and network with Student.io" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <header className="px-5 pt-6 md:px-10 md:pt-8">
        <h1 className="text-3xl font-bold font-poppins text-black">
          Student.io
        </h1>
      </header>

      <main className="flex flex-col flex-1 px-5 pt-6 pb-8">
        <div className="mb-8">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 15 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-700 font-medium font-poppins leading-relaxed"
          >
            Expand Your Knowledge and Network with Student.io.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -15 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 space-y-1"
          >
            <h2 className="text-3xl font-bold text-gray-900 font-poppins">Create.</h2>
            <h2 className="text-3xl font-bold text-gray-900 font-poppins">Connect.</h2>
            <h2 className="text-3xl font-bold text-gray-900 font-poppins">Collaborate.</h2>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex-1 flex flex-col border-none shadow-none"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 font-poppins border-none shadow-none">
            Powered by AI to enhance your learning journey
          </h3>
          <p className="text-base text-gray-600 mb-8 leading-relaxed font-inter">
            Join thousands of students using advanced AI tools to connect, collaborate, and accelerate their academic success.
          </p>
          
          <div className="mt-auto flex flex-col border-none shadow-none ">
            
              <LoginButton />
            

            <p className="text-xs text-gray-500 text-center mt-4">
              By signing up, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}