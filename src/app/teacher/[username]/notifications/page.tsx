// src/app/teacher/[username]/notifications/page.tsx
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
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  onSnapshot 
} from 'firebase/firestore';

export default function TeacherNotificationsPage() {
  const { user, profile } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [collegesMap, setCollegesMap] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);
  const username = params.username as string;

  useEffect(() => {
    if (!user?.uid) return;
    
    // Query for all colleges created by this teacher
    const fetchColleges = async () => {
      const collegesQuery = query(
        collection(db, 'colleges'),
        where('createdBy', '==', user.uid)
      );
      
      const collegesSnapshot = await getDocs(collegesQuery);
      const collegesData: {[key: string]: any} = {};
      
      collegesSnapshot.docs.forEach(doc => {
        collegesData[doc.id] = {
          id: doc.id,
          ...doc.data()
        };
      });
      
      setCollegesMap(collegesData);
      
      // If we have colleges, set up listeners for join requests
      if (collegesSnapshot.docs.length > 0) {
        const collegeIds = collegesSnapshot.docs.map(doc => doc.id);
        
        const requestsQuery = query(
          collection(db, 'requests'),
          where('collegeId', 'in', collegeIds),
          where('status', '==', 'pending')
        );
        
        const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
          const requestsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setRequests(requestsData);
          setLoading(false);
        });
        
        return unsubscribe;
      } else {
        setLoading(false);
      }
    };
    
    fetchColleges();
  }, [user?.uid]);

  const handleRequest = async (requestId: string, collegeId: string, action: 'accept' | 'reject') => {
    try {
      const requestRef = doc(db, 'requests', requestId);
      const collegeRef = doc(db, 'colleges', collegeId);

      await updateDoc(requestRef, { status: action });
      
      if (action === 'accept') {
        const requestDoc = await getDoc(requestRef);
        const studentId = requestDoc.data()?.studentId;
        await updateDoc(collegeRef, {
          students: arrayUnion(studentId)
        });
      }
    } catch (error) {
      console.error('Error handling request:', error);
      alert('Failed to process request. Please try again.');
    }
  };

  return (
    <AuthGuard requireAuth={true} requireRole="teacher">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Notifications</h1>
            <div className="flex items-center gap-4">
              <Link
                href={`/home/teacher/${username}`}
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
                Join Requests
              </h3>
              <p className="max-w-2xl mt-1 text-sm text-gray-500">
                Students waiting to join your colleges
              </p>
            </div>
            <div className="px-4 py-5 border-t border-gray-200">
              {loading ? (
                <div className="py-4 text-center">Loading notifications...</div>
              ) : requests.length === 0 ? (
                <div className="py-4 text-center text-gray-500">No pending requests</div>
              ) : (
                <div className="space-y-4">
                  {requests.map(request => (
                    <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="font-medium">{request.studentName}</h4>
                          <p className="text-sm text-gray-600">{request.studentEmail}</p>
                          <p className="text-sm font-medium text-blue-600">
                            College: {collegesMap[request.collegeId]?.name || 'Unknown College'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Requested: {request.createdAt?.toDate?.().toLocaleString() || 'Unknown date'}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleRequest(request.id, request.collegeId, 'reject')}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleRequest(request.id, request.collegeId, 'accept')}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                          >
                            Accept
                          </button>
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