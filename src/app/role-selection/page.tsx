'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { UserRole } from '@/types/role';
import { toast, Toaster } from 'react-hot-toast';
import { 
  ChevronDown, 
  User,
  ArrowRight,
  Flame
} from 'lucide-react';
import Link from 'next/link';

export default function RoleSelectionPage() {
  const { profile, updateUserRole } = useAuth();
  const [username, setUsername] = useState(profile?.username || '');
  const [role, setRole] = useState<UserRole | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const roles = [
    { id: 'student', label: 'Student' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'mentor', label: 'Mentor' },
    { id: 'company', label: 'Company' }
  ];
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !role) {
      toast.error('Please provide both username and role');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateUserRole(username, role);
      toast.success('Profile updated successfully');
      router.push(`/home/${role}/${username}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Something went wrong');
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
            }
          }}
        />
        
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center mb-12">
            <Link href="/" className="flex items-center">
              {/* <Flame className="w-6 h-6 mr-2 text-black" />  */}
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
            
            <form className="space-y-8" onSubmit={handleSubmit}>
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
                  className="block w-full px-3 py-3 text-black bg-white border border-gray-200 focus:border-black focus:ring-0 placeholder-gray-400"
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
                    className="flex items-center justify-between w-full px-3 py-3 text-left text-black bg-white border border-gray-200 focus:border-black focus:ring-0"
                  >
                    <span>{role ? roles.find(r => r.id === role)?.label : 'Select your role'}</span>
                    <ChevronDown className="w-4 h-4 ml-2 text-gray-600" />
                  </button>
                  
                  {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-sm">
                      {roles.map((option) => (
                        <div 
                          key={option.id}
                          onClick={() => {
                            setRole(option.id as UserRole);
                            setIsOpen(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-50"
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!username || !role || isSubmitting}
                className="flex items-center justify-center w-full px-4 py-3 mt-8 text-white bg-black border-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
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