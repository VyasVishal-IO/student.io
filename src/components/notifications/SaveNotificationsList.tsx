// src/components/notifications/SaveNotificationsList.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SaveNotificationsList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientUserId', '==', user.uid),
      where('type', '==', 'save'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <div className="space-y-4">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
        >
          <Link href={`/${notification.contentType}/${notification.contentId}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">
                  {notification.senderName 
                    ? `${notification.senderName} saved your ${notification.contentType}`
                    : `Your ${notification.contentType} was saved`}
                </p>
                {notification.contentTitle && (
                  <p className="text-sm text-gray-600 mt-1">
                    "{notification.contentTitle}"
                  </p>
                )}
                <small className="text-gray-500 block mt-1">
                  {new Date(notification.createdAt?.toDate()).toLocaleString()}
                </small>
              </div>
              {!notification.read && (
                <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}