// components/collage/JoinCollegeButton.tsx
'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function JoinCollegeButton({ collegeId }: { collegeId: string }) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'joinRequests'), {
        studentId: user.uid,
        studentName: profile.displayName,
        collegeId,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      toast.success('Join request sent to admin');
    } catch (error) {
      toast.error('Error sending request');
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Sending...' : 'Join College'}
    </button>
  );
}