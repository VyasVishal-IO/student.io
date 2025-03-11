// components/college/TeacherRequestsList.tsx
'use client';

import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TeacherRequestsList({ requests, collegeId }: any) {
  const handleRequest = async (requestId: string, action: 'accept' | 'reject') => {
    const requestRef = doc(db, 'teacherRequests', requestId);
    const collegeRef = doc(db, 'colleges', collegeId);

    await updateDoc(requestRef, { status: action });
    
    if (action === 'accept') {
      const requestDoc = await getDoc(requestRef);
      const teacherId = requestDoc.data()?.teacherId;
      await updateDoc(collegeRef, {
        teachers: arrayUnion(teacherId)
      });
    }
  };

  return (
    <div className="space-y-3">
      {requests.map((request: any) => (
        <div key={request.id} className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-medium">{request.teacherName}</h3>
              <p className="text-xs text-gray-500">
                {request.createdAt?.toDate?.().toLocaleString() || 'Unknown date'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRequest(request.id, 'reject')}
                className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleRequest(request.id, 'accept')}
                className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}