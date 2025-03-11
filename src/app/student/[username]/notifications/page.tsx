// src/app/student/[username]/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  doc,
  getDoc,
  DocumentData
} from 'firebase/firestore';
import { JoinRequest } from '@/types/college';

export default function StudentNotificationsPage() {
  const { profile } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const username = params.username as string;

  useEffect(() => {
    if (!profile?.uid) return;

    const requestsQuery = query(
      collection(db, 'requests'),
      where('studentId', '==', profile.uid)
    );

    const unsubscribe = onSnapshot(requestsQuery, async (snapshot) => {
      const requestsPromises = snapshot.docs.map(async (requestDoc) => {
        const data = requestDoc.data();
        let collegeName = 'Unknown College';
        
        try {
          // Correct usage of `doc` to create a document reference
          const collegeDocRef = doc(db, 'colleges', data.collegeId);
          const collegeDoc = await getDoc(collegeDocRef);
          if (collegeDoc.exists()) {
            collegeName = (collegeDoc.data() as DocumentData).name || collegeName;
          }
        } catch (error) {
          console.error('Error fetching college:', error);
        }

        return {
          id: requestDoc.id,
          collegeId: data.collegeId,
          studentId: data.studentId,
          studentName: data.studentName,
          studentEmail: data.studentEmail,
          status: data.status,
          createdAt: data.createdAt?.toDate(),
          processedDate: data.processedDate?.toDate(),
          message: data.message,
          collegeName,
          teacherId: data.teacherId
        } as JoinRequest;
      });

      const resolvedRequests = await Promise.all(requestsPromises);
      setRequests(resolvedRequests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.uid]);

  const getStatusBadge = (status: JoinRequest['status']) => {
    const baseStyle = 'px-2 py-1 text-xs rounded-full';
    switch (status) {
      case 'accepted':
        return `${baseStyle} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseStyle} bg-red-100 text-red-800`;
      default:
        return `${baseStyle} bg-yellow-100 text-yellow-800`;
    }
  };

  return (
    <AuthGuard requireAuth={true} requireRole="student">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Request Notifications</h1>
            <div className="flex items-center gap-4">
              <Link
                href={`/home/student/${username}`}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                College Join Requests
              </h3>
              <p className="max-w-2xl mt-1 text-sm text-gray-500">
                Track the status of your college membership requests
              </p>
            </div>
            <div className="px-4 py-5 border-t border-gray-200">
              {loading ? (
                <div className="py-4 text-center">Loading requests...</div>
              ) : requests.length === 0 ? (
                <div className="py-4 text-center text-gray-500">No pending requests found</div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">
                            {request.collegeName}
                          </h4>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-gray-600">
                              Sent: {request.createdAt?.toLocaleDateString()}
                            </p>
                            {request.processedDate && (
                              <p className="text-sm text-gray-600">
                                Updated: {request.processedDate?.toLocaleDateString()}
                              </p>
                            )}
                            {request.message && (
                              <p className="text-sm text-gray-600">
                                Message: {request.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={getStatusBadge(request.status)}>
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}