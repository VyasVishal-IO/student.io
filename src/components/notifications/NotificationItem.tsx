// import { useState } from 'react';
// import { db } from '@/lib/firebase';
// import { doc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
// import { toast } from 'react-hot-toast';
// import { useAuth } from '@/context/AuthContext';

// interface Notification {
//   id: string;
//   type: 'joinRequest' | 'joinRequestAccepted' | 'joinRequestRejected' | 'save';
//   recipientUserId: string;
//   senderUserId: string;
//   contentId: string;
//   contentType: string;
//   read: boolean;
//   createdAt: Date | Timestamp;
//   contentTitle?: string;
//   senderName?: string;
//   actionType?: 'accept' | 'reject';
//   actioned?: boolean;
//   actionedAt?: Date | Timestamp;
//   actionedBy?: string;
// }

// interface ExtendedNotification extends Notification {
//   projectId: string;
//   projectTitle: string;
//   senderId: string;
//   senderName: string;
//   userEmail?: string;
//   userAvatar?: string;
//   status?: 'pending' | 'accepted' | 'rejected';
//   recipientId?: string;
// }

// export default function NotificationItem({ 
//   notification, 
//   onActionComplete 
// }: { 
//   notification: ExtendedNotification;
//   onActionComplete?: () => void; 
// }) {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Determine if this is a join request notification that needs action buttons
//   const isJoinRequest = notification.type === 'joinRequest';
//   const showActions = isJoinRequest && !notification.read;

//   const handleAction = async (action: 'accept' | 'reject') => {
//     if (!user) {
//       toast.error('You must be logged in to perform this action');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
    
//     try {
//       // Update request status in joinRequests collection
//       const requestRef = doc(db, 'projects', notification.projectId, 'joinRequests', notification.id);
//       await updateDoc(requestRef, { 
//         status: action === 'accept' ? 'accepted' : 'rejected',
//         updatedAt: serverTimestamp(),
//         updatedBy: user.uid
//       });
      
//       // If accepting, add to members collection
//       if (action === 'accept') {
//         const memberRef = doc(db, 'projects', notification.projectId, 'members', notification.senderId);
//         await setDoc(memberRef, {
//           userId: notification.senderId,
//           displayName: notification.senderName,
//           email: notification.userEmail || '',
//           joinedAt: serverTimestamp(),
//           avatar: notification.userAvatar || null
//         });
//       }

//       // Mark current notification as read
//       const notificationRef = doc(db, 'notifications', notification.id);
//       await updateDoc(notificationRef, { 
//         read: true,
//         actioned: true,
//         actionType: action,
//         actionedAt: serverTimestamp(),
//         actionedBy: user.uid
//       });

//       // Create a new notification for the requester
//       const responseNotificationRef = doc(db, 'notifications');
//       await setDoc(responseNotificationRef, {
//         id: responseNotificationRef.id,
//         type: action === 'accept' ? 'joinRequestAccepted' : 'joinRequestRejected',
//         recipientId: notification.senderId,
//         recipientUserId: notification.senderId,
//         senderUserId: user.uid,
//         senderId: user.uid,
//         senderName: user.displayName || 'Project Owner',
//         projectId: notification.projectId,
//         projectTitle: notification.projectTitle,
//         contentId: notification.projectId,
//         contentType: 'projects',
//         status: action,
//         read: false,
//         createdAt: serverTimestamp()
//       });

//       // Show success message
//       toast.success(`Request ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
      
//       // Call the callback if provided
//       if (onActionComplete) {
//         onActionComplete();
//       }
//     } catch (err) {
//       console.error(`Error ${action}ing request:`, err);
//       setError(`Failed to ${action} request. Please try again.`);
//       toast.error(`Failed to ${action} request`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatDate = (timestamp: Date | Timestamp) => {
//     const date = timestamp instanceof Date ? timestamp : new Date(timestamp.toDate?.() || timestamp);
    
//     // If less than 24 hours ago, show relative time
//     const now = new Date();
//     const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
//     if (diffInHours < 24) {
//       if (diffInHours < 1) {
//         return `${Math.floor(diffInHours * 60)} minutes ago`;
//       }
//       return `${Math.floor(diffInHours)} hours ago`;
//     }
    
//     return date.toLocaleDateString(undefined, { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   // Determine notification message based on type
//   const getNotificationMessage = () => {
//     switch(notification.type) {
//       case 'joinRequest':
//         return `${notification.senderName} wants to join "${notification.projectTitle}"`;
//       case 'joinRequestAccepted':
//         return `Your request to join "${notification.projectTitle}" was accepted`;
//       case 'joinRequestRejected':
//         return `Your request to join "${notification.projectTitle}" was declined`;
//       case 'save':
//         return `${notification.senderName} saved your ${notification.contentType.slice(0, -1)} "${notification.contentTitle}"`;
//       default:
//         return `New notification from ${notification.senderName}`;
//     }
//   };

//   // Determine icon based on notification type
//   const getNotificationIcon = () => {
//     switch(notification.type) {
//       case 'joinRequest':
//         return (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
//           </svg>
//         );
//       case 'joinRequestAccepted':
//         return (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//         );
//       case 'joinRequestRejected':
//         return (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//           </svg>
//         );
//       case 'save':
//         return (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
//           </svg>
//         );
//       default:
//         return (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//         );
//     }
//   };

//   return (
//     <div className={`border rounded-lg p-4 mb-3 ${notification.read ? 'bg-white' : 'bg-blue-50'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
//       {error && (
//         <div className="mb-2 p-2 bg-red-50 text-red-600 text-sm rounded">
//           {error}
//         </div>
//       )}
      
//       <div className="flex justify-between items-start gap-4">
//         <div className="flex items-start gap-3">
//           <div className="mt-1">
//             {getNotificationIcon()}
//           </div>
//           <div>
//             <p className="font-medium text-gray-900">
//               {getNotificationMessage()}
//             </p>
//             <p className="text-sm text-gray-500">
//               {formatDate(notification.createdAt)}
//             </p>
//           </div>
//         </div>
        
//         {showActions && (
//           <div className="flex gap-2 items-center">
//             <button 
//               onClick={() => handleAction('accept')}
//               disabled={isLoading}
//               className="px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Processing...' : 'Accept'}
//             </button>
//             <button
//               onClick={() => handleAction('reject')}
//               disabled={isLoading}
//               className="px-4 py-1.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Reject
//             </button>
//           </div>
//         )}
        
//         {notification.read && notification.actionType && (
//           <span className={`text-sm px-2 py-










// New component: src/components/notifications/NotificationItem.tsx
import { Notification } from '@/types/content';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, FieldValue } from 'firebase/firestore';

export default function NotificationItem({ notification }: { notification: Notification }) {
  const { user } = useAuth();

  const handleAccept = async () => {
    if (!user) return;

    // Ensure that notification.projectId and notification.id are defined
    if (!notification.projectId || !notification.id) {
      console.error('Project ID or Notification ID is undefined');
      return;
    }

    const requestRef = doc(db, 'projects', notification.projectId, 'joinRequests', notification.id);
    await updateDoc(requestRef, { status: 'accepted' });

    if (!notification.projectId || !notification.senderId) {
      console.error('Project ID or Sender ID is undefined');
      return; // Exit the function early if either value is undefined
    }

    // Create a reference to the member document
    const memberRef = doc(db, 'projects', notification.projectId, 'members', notification.senderId);

    // Set the member document
    await setDoc(memberRef, {
      userId: notification.senderId,
      displayName: notification.senderName,
      email: notification.userEmail,
      joinedAt: new Date(),
      avatar: notification.userAvatar
    });

    // Mark notification as read
    const notificationRef = doc(db, 'notifications', notification.id);
    await updateDoc(notificationRef, { read: true });
  };

  const handleReject = async () => {
    if (!notification.projectId || !notification.id) {
      console.error('Project ID or Notification ID is undefined');
      return;
    }

    const requestRef = doc(db, 'projects', notification.projectId, 'joinRequests', notification.id);
    await updateDoc(requestRef, { status: 'rejected' });

    const notificationRef = doc(db, 'notifications', notification.id);
    await updateDoc(notificationRef, { read: true });
  };

  return (
    <div className="border rounded p-4 mb-2 bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">
            {notification.senderName} wants to join "{notification.projectTitle}"
          </p>
          <p className="text-sm text-gray-500">
            {/* {new Date(notification.createdAt).toLocaleDateString()} */}
          </p>
        </div>
        {!notification.read && (
          <div className="flex gap-2">
            <button 
              onClick={handleAccept}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}