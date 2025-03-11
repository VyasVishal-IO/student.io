// src/components/NotificationProjectRequest.tsx (updated)
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function NotificationProjectRequest() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid),
      where('type', 'in', ['projectJoinRequest', 'joinRequestAccepted'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(data.sort((a, b) => b.createdAt - a.createdAt));
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    await updateDoc(doc(db, 'notifications', notificationId), { read: true });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Project Notifications</h2>
      {notifications.map(notification => (
        <div key={notification.id} className={`border p-4 rounded ${notification.read ? 'bg-gray-50' : 'bg-white'}`}>
          {notification.type === 'projectJoinRequest' ? (
            <>
              <p className="font-medium">
                {notification.senderName} wants to join your project "{notification.projectTitle}"
              </p>
              <div className="mt-2 flex gap-2">
                <Link 
                  href={`/projects/${notification.projectId}`}
                  className="text-blue-500 hover:underline"
                >
                  View Project
                </Link>
                <button 
                  onClick={() => markAsRead(notification.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Mark as read
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="font-medium">
                Your request to join "{notification.projectTitle}" has been accepted by {notification.senderName}
              </p>
              <div className="mt-2 flex gap-2">
                <Link
                  href={`/projects/${notification.projectId}`}
                  className="text-blue-500 hover:underline"
                >
                  View Project
                </Link>
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Mark as read
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}