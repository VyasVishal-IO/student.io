// pages/api/follow/request.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { receiverId } = req.body;
  const auth = getAuth();
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const decodedToken = await auth.verifyIdToken(token!);
    const senderId = decodedToken.uid;

    // Check if request already exists
    const q = query(
      collection(db, 'followRequests'),
      where('senderId', '==', senderId),
      where('receiverId', '==', receiverId)
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return res.status(400).json({ error: 'Request already sent' });

    // Create new request
    const docRef = await addDoc(collection(db, 'followRequests'), {
      senderId,
      receiverId,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send follow request' });
  }
}