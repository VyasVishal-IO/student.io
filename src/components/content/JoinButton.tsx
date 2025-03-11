// // src/components/JoinButton.tsx
// import { useState } from 'react';
// import { db } from '@/lib/firebase';
// import { collection, doc, setDoc } from 'firebase/firestore';
// import { useAuth } from '@/context/AuthContext';

// export default function JoinButton({ 
//   projectId, 
//   projectTitle,
//   createdBy
// }: { 
//   projectId: string; 
//   projectTitle: string;
//   createdBy: string; 
// }) {
//   const { user, profile } = useAuth();
//   const [loading, setLoading] = useState(false);

//   const handleJoin = async () => {
//     if (!user || !profile || !createdBy) {
//       alert('Missing required information to join project');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Create join request
//       const requestRef = doc(collection(db, 'projects', projectId, 'joinRequests'));
//       await setDoc(requestRef, {
//         userId: user.uid,
//         status: 'pending',
//         userData: {
//           displayName: profile.displayName,
//           email: profile.email,
//           photoURL: profile.photoURL
//         },
//         createdAt: new Date(),
//       });

//       // Create notification for project owner
//       const notificationRef = doc(collection(db, 'notifications'));
//       await setDoc(notificationRef, {
//         type: 'projectJoinRequest',
//         recipientId: createdBy,
//         senderId: user.uid,
//         senderName: profile.displayName || 'Anonymous',
//         projectId,
//         projectTitle: projectTitle || 'Untitled Project',
//         status: 'pending',
//         read: false,
//         createdAt: new Date(),
//       });
//     } catch (error) {
//       console.error('Error joining project:', error);
//       alert('Error sending join request');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button 
//       onClick={handleJoin}
//       disabled={loading}
//       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//     >
//       {loading ? 'Sending...' : 'Join Project'}
//     </button>
//   );
// }