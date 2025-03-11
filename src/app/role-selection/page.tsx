'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { UserRole } from '@/types/role';
import { toast, Toaster } from 'react-hot-toast';
import { 
  ChevronDown, 
  User,
  ArrowRight,
  Flame,
  Key,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function RoleSelectionPage() {
  const { profile, updateUserRole } = useAuth();
  const [username, setUsername] = useState(profile?.username || '');
  const [role, setRole] = useState<UserRole | ''>('');
  const [secretKey, setSecretKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSecretKeyInput, setShowSecretKeyInput] = useState(false);
  const router = useRouter();
  
  const roles = [
    { id: 'student', label: 'Student' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'mentor', label: 'Mentor' },
    { id: 'company', label: 'Company' }
  ];

  // Update showSecretKeyInput whenever role changes
  useEffect(() => {
    // Reset secret key when changing roles
    setSecretKey('');
    // Only show secret key input for non-student roles
    setShowSecretKeyInput(role !== '' && role !== 'student');
  }, [role]);
  
  const verifySecretKey = async (key: string): Promise<boolean> => {
    try {
      // Use relative path to ensure it works in all environments
      const response = await fetch('/api/verify-secret-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error('Error verifying secret key:', error);
      return false;
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a valid username');
      return;
    }
    
    if (!role) {
      toast.error('Please select a role');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If role is not student, verify secret key
      if (role !== 'student') {
        if (!secretKey.trim()) {
          toast.error('Secret key is required for this role');
          setIsSubmitting(false);
          return;
        }
        
        // Show loading toast
        const loadingToast = toast.loading('Verifying secret key...');
        
        const isValidKey = await verifySecretKey(secretKey);
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        if (!isValidKey) {
          toast.error('Invalid secret key. Please try again or contact an administrator.');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Show loading toast for profile update
      const updateToast = toast.loading('Updating profile...');
      
      await updateUserRole(username.trim(), role as UserRole);
      
      // Dismiss loading toast
      toast.dismiss(updateToast);
      
      toast.success('Profile updated successfully');
      
      // Add a small delay before redirecting to ensure toast is seen
      setTimeout(() => {
        router.push(`/home/${role}/${username.trim()}`);
      }, 500);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AuthGuard requireAuth={true} requireRole={undefined}>
      <div className="min-h-screen bg-white">
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              borderRadius: '2px',
            },
            // Add duration for all toasts
            duration: 4000,
          }}
        />
        
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center mb-12">
            <Link href="/" className="flex items-center">
              <Flame className="w-6 h-6 mr-2 text-black" /> 
              <span className="text-lg font-medium tracking-tight text-black">Student.io</span>
            </Link>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl font-light text-black tracking-tight">
                Choose your role
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Select how you want to use the platform
              </p>
            </div>
            
            <form className="space-y-8" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label 
                  htmlFor="username"
                  className="block text-sm font-light text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="block w-full px-3 py-3 text-black bg-white border border-gray-200 rounded-sm focus:border-black focus:ring-0 placeholder-gray-400"
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-light text-gray-700">
                  Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full px-3 py-3 text-left text-black bg-white border border-gray-200 rounded-sm focus:border-black focus:ring-0"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                  >
                    <span>{role ? roles.find(r => r.id === role)?.label : 'Select your role'}</span>
                    <ChevronDown className="w-4 h-4 ml-2 text-gray-600" />
                  </button>
                  
                  {isOpen && (
                    <div 
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-sm rounded-sm"
                      role="listbox"
                    >
                      {roles.map((option) => (
                        <div 
                          key={option.id}
                          onClick={() => {
                            setRole(option.id as UserRole);
                            setIsOpen(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-50"
                          role="option"
                          aria-selected={role === option.id}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Secret Key Input - Only shown for non-student roles */}
              {showSecretKeyInput && (
                <div className="space-y-2">
                  <label 
                    htmlFor="secretKey"
                    className="block text-sm font-light text-gray-700"
                  >
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-1 text-gray-600" />
                      <span>Secret Key</span>
                    </div>
                  </label>
                  <input
                    id="secretKey"
                    name="secretKey"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter the secret key for this role"
                    className="block w-full px-3 py-3 text-black bg-white border border-gray-200 rounded-sm focus:border-black focus:ring-0 placeholder-gray-400"
                    autoComplete="off"
                  />
                  <p className="text-xs text-gray-500">
                    A secret key is required for teacher, mentor, and company roles
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!username.trim() || !role || isSubmitting || (showSecretKeyInput && !secretKey.trim())}
                className="flex items-center justify-center w-full px-4 py-3 mt-8 text-white bg-black border-0 rounded-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}