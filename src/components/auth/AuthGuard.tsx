// src/components/auth/AuthGuard.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true,
  requireRole
}: AuthGuardProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to login if not authenticated
        router.push('/');
      } else if (user && !profile?.role) {
        // Redirect to role selection if no role is set
        router.push('/role-selection');
      } else if (requireRole && profile?.role !== requireRole) {
        // Redirect to home page if wrong role
        if (profile?.role && profile.username) {
          router.push(`/home/${profile.role}/${profile.username}`);
        } else {
          router.push('/role-selection');
        }
      }
    }
  }, [loading, user, profile, requireAuth, requireRole, router]);
  
  // Show loading state or children
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (requireAuth && !user) {
    return null;
  }
  
  if (requireRole && profile?.role !== requireRole) {
    return null;
  }
  
  return <>{children}</>;
}