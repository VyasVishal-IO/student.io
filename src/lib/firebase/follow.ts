// lib/firebase/follow.ts
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export const acceptFollowRequest = async (requestId: string) => {
  const requestRef = doc(db, 'followRequests', requestId);
  await updateDoc(requestRef, { status: 'accepted' });
  
  // Update user's followers/following arrays
  // Implement this based on your user structure
};

export const rejectFollowRequest = async (requestId: string) => {
  const requestRef = doc(db, 'followRequests', requestId);
  await updateDoc(requestRef, { status: 'rejected' });
};

export const checkFollowStatus = async (currentUserId: string, targetUserId: string) => {
  const q = query(
    collection(db, 'followRequests'),
    where('senderId', '==', currentUserId),
    where('receiverId', '==', targetUserId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs[0]?.data()?.status || 'not_following';
};