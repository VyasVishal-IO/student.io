'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginButton from '@/components/auth/LoginButton';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner'; // Import the spinner

export default function LoginPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsRedirecting(true); // Show spinner while redirecting

      const timer = setTimeout(() => {
        if (user) {
          if (!profile?.role) {
            router.push('/role-selection');
          } else if (profile.role && profile.username) {
            router.push(`/home/${profile.role}/${profile.username}`);
          }
        }
        setIsRedirecting(false); // Hide spinner after redirection
      }, 1000); // Optional delay before redirect

      return () => clearTimeout(timer);
    }
  }, [user, profile, loading, router]);

  if (loading || isRedirecting) {
    return <LoadingSpinner />; // Show spinner while loading or redirecting
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600">Student.io</h1>
          <p className="mt-2 text-gray-600">
            Connect with students, teachers, mentors, and companies
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
