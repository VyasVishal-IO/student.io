// 'use client';

// import { JoinRequest } from '@/types/content';

// interface ProjectJoinListProps {
//   joinRequests: JoinRequest[];
//   onRequestResponse: (requestId: string, status: 'accepted' | 'rejected') => void;
// }

// export default function ProjectJoinList({ 
//   joinRequests, 
//   onRequestResponse 
// }: ProjectJoinListProps) {
//   const pendingRequests = joinRequests.filter(req => req.status === 'pending');

//   return (
//     <div className="mb-6">
//       <h2 className="text-xl font-semibold mb-3">Join Requests</h2>
//       {pendingRequests.length === 0 ? (
//         <p className="text-gray-500">No pending join requests</p>
//       ) : (
//         <div className="space-y-2">
//           {pendingRequests.map(request => (
//             <div 
//               key={request.id} 
//               className="flex items-center justify-between bg-gray-100 p-3 rounded"
//             >
//               <span>{request.userId}</span>
//               <div className="space-x-2">
//                 <button
//                   onClick={() => onRequestResponse(request.id, 'accepted')}
//                   className="bg-green-500 text-white px-3 py-1 rounded text-sm"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => onRequestResponse(request.id, 'rejected')}
//                   className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MemberRole } from '@/types/project';

interface JoinRequest {
  id: string;
  projectId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: Date;
}

export default function ProjectJoinRequestsList({ projectId }: { projectId: string }) {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const requestsQuery = query(
          collection(db, 'joinRequests'), 
          where('projectId', '==', projectId),
          where('status', '==', 'pending')
        );

        const snapshot = await getDocs(requestsQuery);
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as JoinRequest));

        setJoinRequests(requests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching join requests:', error);
        setLoading(false);
      }
    };

    fetchJoinRequests();
  }, [projectId]);

  const handleJoinRequestResponse = async (
    requestId: string, 
    status: 'accepted' | 'rejected'
  ) => {
    try {
      const requestRef = doc(db, 'joinRequests', requestId);
      
      // Update join request status
      await updateDoc(requestRef, { 
        status,
        processedAt: new Date()
      });

      if (status === 'accepted') {
        // Add user as project member
        await addDoc(collection(db, 'projectMembers'), {
          projectId,
          userId: joinRequests.find(r => r.id === requestId)?.userId,
          role: MemberRole.CONTRIBUTOR,
          joinedAt: new Date(),
          skills: [] // Can be expanded later
        });
      }

      // Remove the processed request from the list
      setJoinRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error processing join request:', error);
    }
  };

  if (loading) return <div>Loading join requests...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Join Requests</h2>
      
      {joinRequests.length === 0 ? (
        <p className="text-gray-500">No pending join requests</p>
      ) : (
        <div className="space-y-4">
          {joinRequests.map(request => (
            <div 
              key={request.id} 
              className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
            >
              <div>
                <p className="font-medium">{request.userId}</p>
                <p className="text-sm text-gray-500">
                  Requested on {request.requestedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleJoinRequestResponse(request.id, 'accepted')}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleJoinRequestResponse(request.id, 'rejected')}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}