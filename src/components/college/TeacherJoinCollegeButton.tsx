// components/college/TeacherJoinCollegeButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TeacherJoinCollegeButton({ collegeId, teacherId, teacherName }: any) {
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    const checkExistingRequest = async () => {
      const q = query(
        collection(db, 'teacherRequests'),
        where('collegeId', '==', collegeId),
        where('teacherId', '==', teacherId),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      setHasRequested(!snapshot.empty);
    };
    checkExistingRequest();
  }, [collegeId, teacherId]);

  const handleJoin = async () => {
    await addDoc(collection(db, 'teacherRequests'), {
      collegeId,
      teacherId,
      teacherName,
      status: 'pending',
      createdAt: new Date()
    });
    setHasRequested(true);
  };

  return hasRequested ? (
    <div className="flex items-center text-green-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Join request sent! Waiting for approval.
    </div>
  ) : (
    <button
      onClick={handleJoin}
      className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
    >
      Request to Join as Teacher
    </button>
  );
}