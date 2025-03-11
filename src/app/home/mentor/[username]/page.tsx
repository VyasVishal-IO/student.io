// src/app/home/mentor/[username]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import EditMentorProfile from '@/components/profile/EditMentorProfile';

export default function MentorHomePage() {
  const { profile, logout } = useAuth();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  
  const username = params.username as string;
  
  return (
    <AuthGuard requireAuth={true} requireRole="mentor">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mentor Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{profile?.displayName}</span>
              <button
                onClick={() => logout()}
                className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {isEditing ? (
            <EditMentorProfile 
              onCancel={() => setIsEditing(false)}
              onComplete={() => setIsEditing(false)}
            />
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Mentor Profile
                </h3>
                <p className="max-w-2xl mt-1 text-sm text-gray-500">
                  Professional details and mentorship information.
                </p>
              </div>
              <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {profile?.displayName}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {profile?.username}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {profile?.email}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Specialization</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {(profile as any)?.specialization || 'Not specified'}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Skills</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {(profile as any)?.skills?.join(', ') || 'Not specified'}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Current Position</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {(profile as any)?.position || 'Not specified'} at {(profile as any)?.companyName || 'Not specified'}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Experience (years)</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {(profile as any)?.experience || 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update Profile
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}