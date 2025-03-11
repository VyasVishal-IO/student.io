// components/follow/AllFollowRequests.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { FollowRequest } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export const AllFollowRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'followRequests'),
      where('receiverId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FollowRequest[];
      setRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleResponse = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      // Implement API call to update request status
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(request => (
        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={request.senderProfile?.profileImg} />
              <AvatarFallback>{request.senderProfile?.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{request.senderProfile?.displayName}</h3>
              <p className="text-sm text-neutral-500">Sent {request.createdAt?.toDate().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={() => handleResponse(request.id, 'accepted')}
            >
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResponse(request.id, 'rejected')}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
      {requests.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          No pending follow requests
        </div>
      )}
    </div>
  );
};