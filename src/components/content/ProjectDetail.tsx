// // // // import { Project, Notification } from '@/types/content';
// // // // import SaveButton from './SaveButton';
// // // // import { useAuth } from '@/context/AuthContext';
// // // // import { useEffect, useState } from 'react';
// // // // import { db } from '@/lib/firebase';
// // // // import { 
// // // //   collection, 
// // // //   doc, 
// // // //   onSnapshot, 
// // // //   query, 
// // // //   setDoc, 
// // // //   serverTimestamp,
// // // //   Timestamp
// // // // } from 'firebase/firestore';
// // // // import ShareButton from './ShareButton';
// // // // import LinkButton from './LinkButton';
// // // // import ContributionForm from './ContributionForm';


// // // // interface MemberData {
// // // //   userId: string;
// // // //   displayName: string;
// // // //   email: string;
// // // //   joinedAt: Date | Timestamp;
// // // //   // avatar?: string;
// // // // }

// // // // interface Contribution {
// // // //   id: string;
// // // //   text: string;
// // // //   userName: string;
// // // //   userId: string;
// // // //   userAvatar?: string;
// // // //   createdAt: Date | Timestamp;
// // // //   links?: Array<{ title: string; url: string }>;
// // // // }

// // // // interface JoinRequestType {
// // // //   id: string;
// // // //   userId: string;
// // // //   userName: string;
// // // //   userEmail: string;
// // // //   avatar?: string;
// // // //   status: 'pending' | 'accepted' | 'rejected';
// // // //   timestamp: Date | Timestamp;
// // // // }

// // // // export default function ProjectDetail({ project }: { project: Project }) {
// // // //   const { user, profile } = useAuth();
// // // //   const [requests, setRequests] = useState<JoinRequestType[]>([]);
// // // //   const [members, setMembers] = useState<MemberData[]>([]);
// // // //   const [contributions, setContributions] = useState<Contribution[]>([]);
// // // //   const [isUserMember, setIsUserMember] = useState(false);
// // // //   const [hasPendingRequest, setHasPendingRequest] = useState(false);

// // // //   // Fetch contributions
// // // //   useEffect(() => {
// // // //     if (!project.id) return;

// // // //     const contributionsRef = collection(db, 'projects', project.id, 'contributions');
// // // //     const unsubscribe = onSnapshot(contributionsRef, (snapshot) => {
// // // //       const contribs = snapshot.docs.map(doc => ({
// // // //         id: doc.id,
// // // //         ...doc.data()
// // // //       })) as Contribution[];
      
// // // //       // Sort by creation date (newest first)
// // // //       contribs.sort((a, b) => {
// // // //         const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt.toDate?.() || a.createdAt);
// // // //         const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt.toDate?.() || b.createdAt);
// // // //         return dateB.getTime() - dateA.getTime();
// // // //       });
      
// // // //       setContributions(contribs);
// // // //     });

// // // //     return () => unsubscribe();
// // // //   }, [project.id]);

// // // //   // Fetch join requests
// // // //   useEffect(() => {
// // // //     if (!project.id || !user) return;

// // // //     const q = query(collection(db, 'projects', project.id, 'joinRequests'));
// // // //     const unsubscribe = onSnapshot(q, (snapshot) => {
// // // //       const requestsData = snapshot.docs.map(doc => ({
// // // //         id: doc.id,
// // // //         ...doc.data()
// // // //       })) as JoinRequestType[];
      
// // // //       // Filter to only show pending requests
// // // //       const pendingRequests = requestsData.filter(req => req.status === 'pending');
// // // //       setRequests(pendingRequests);
      
// // // //       // Check if current user has a pending request
// // // //       if (user) {
// // // //         const userRequest = requestsData.find(req => 
// // // //           req.userId === user.uid && req.status === 'pending'
// // // //         );
// // // //         setHasPendingRequest(!!userRequest);
// // // //       }
// // // //     });

// // // //     return () => unsubscribe();
// // // //   }, [project.id, user]);

// // // //   // Fetch members
// // // //   useEffect(() => {
// // // //     if (!project.id) return;

// // // //     const membersRef = collection(db, 'projects', project.id, 'members');
// // // //     const unsubscribe = onSnapshot(membersRef, (snapshot) => {
// // // //       const membersData = snapshot.docs.map(doc => ({
// // // //         userId: doc.data().userId || '', // Provide default values for missing properties
// // // //         displayName: doc.data().displayName || '',
// // // //         email: doc.data().email || '',
// // // //         joinedAt: doc.data().joinedAt || new Date(),
// // // //         id: doc.id
// // // //     })) as MemberData[];
      
// // // //       setMembers(membersData);
      
// // // //       // Check if current user is a member
// // // //       if (user) {
// // // //         setIsUserMember(membersData.some(m => m.userId === user.uid));
// // // //       }
// // // //     });

// // // //     return () => unsubscribe();
// // // //   }, [project.id, user]);

// // // //   const formatDate = (timestamp: Date | Timestamp) => {
// // // //     const date = timestamp instanceof Date ? timestamp : new Date(timestamp.toDate?.() || timestamp);
// // // //     return date.toLocaleDateString(undefined, {
// // // //       year: 'numeric',
// // // //       month: 'short',
// // // //       day: 'numeric'
// // // //     });
// // // //   };

// // // //   return (
// // // //     <div className="bg-white rounded-lg shadow p-6">
// // // //       <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      
// // // //       {/* Action Buttons */}
// // // //       <div className="flex flex-wrap gap-4 mb-6">
// // // //         <SaveButton contentId={project.id} contentType="projects" />
// // // //         <ShareButton contentId={project.id} contentType="projects" />
// // // //         <LinkButton contentId={project.id} contentType="projects" />
        
// // // //         {/* Only show Join button if user is not creator and not already a member */}
// // // //         {user?.uid !== project.createdBy && !isUserMember && !hasPendingRequest && (
// // // //           <JoinButton 
// // // //             projectId={project.id} 
// // // //             creatorId={project.createdBy} 
// // // //             projectTitle={project.title} 
// // // //           />
// // // //         )}
        
// // // //         {/* Show pending status if user has a pending request */}
// // // //         {hasPendingRequest && (
// // // //           <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded flex items-center">
// // // //             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
// // // //               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
// // // //             </svg>
// // // //             Request Pending
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Project Details */}
// // // //       <div className="prose max-w-none mb-8">
// // // //         <p className="text-lg">{project.description}</p>
        
// // // //         {project.links && project.links.length > 0 && (
// // // //           <>
// // // //             <h2 className="text-xl font-bold mt-6 mb-3">Links</h2>
// // // //             <ul className="list-disc pl-6">
// // // //               {project.links.map((link, index) => (
// // // //                 <li key={index}>
// // // //                   <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// // // //                     {link.title}
// // // //                   </a>
// // // //                 </li>
// // // //               ))}
// // // //             </ul>
// // // //           </>
// // // //         )}
// // // //       </div>

// // // //       {/* Members Section */}
// // // //       <MemberSection members={members} />

// // // //       {/* Pending Join Requests Section (Visible to all members) */}
// // // //       {isUserMember && requests.length > 0 && (
// // // //         <div className="mb-8">
// // // //           <h2 className="text-xl font-bold mb-4">Pending Join Requests ({requests.length})</h2>
// // // //           <div className="space-y-4">
// // // //             {requests.map(request => (
// // // //               <div 
// // // //                 key={request.id} 
// // // //                 className="border rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
// // // //               >
// // // //                 <div className="flex items-center gap-3">
// // // //                   {request.avatar && (
// // // //                     <img 
// // // //                       src={request.avatar} 
// // // //                       alt={request.userName}
// // // //                       className="w-10 h-10 rounded-full object-cover" 
// // // //                     />
// // // //                   )}
// // // //                   <div>
// // // //                     <p className="font-medium">{request.userName}</p>
// // // //                     <p className="text-gray-600 text-sm">{request.userEmail}</p>
// // // //                     <p className="text-gray-500 text-xs mt-1">
// // // //                       {formatDate(request.timestamp)}
// // // //                     </p>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Contributions Section */}
// // // //       <div className="mb-8">
// // // //         <h2 className="text-xl font-bold mb-4">Contributions</h2>
        
// // // //         {/* Contribution Form (only for members) */}
// // // //         {isUserMember && (
// // // //           <div className="mb-6">
// // // //             <ContributionForm projectId={project.id} />
// // // //           </div>
// // // //         )}
        
// // // //         {/* List of contributions */}
// // // //         <div className="space-y-4">
// // // //           {contributions.length > 0 ? (
// // // //             contributions.map(contribution => (
// // // //               <ContributionItem key={contribution.id} contribution={contribution} />
// // // //             ))
// // // //           ) : (
// // // //             <p className="text-gray-500 italic">No contributions yet.</p>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // ... (rest of the previous code remains the same)
// // // // // Join Request Item Component
// // // // interface RequestItemProps {
// // // //   request: JoinRequestType;
// // // //   projectId: string;
// // // //   projectTitle: string;
// // // // }

// // // // function RequestItem({ request, projectId, projectTitle }: RequestItemProps) {
// // // //   const { user, profile } = useAuth();
// // // //   const [loading, setLoading] = useState(false);

// // // //   const handleDecision = async (status: 'accepted' | 'rejected') => {
// // // //     if (!user || !profile) return;
// // // //     setLoading(true);
    
// // // //     try {
// // // //       // Update request status
// // // //       const requestRef = doc(db, 'projects', projectId, 'joinRequests', request.id);
// // // //       await setDoc(requestRef, { 
// // // //         status,
// // // //         updatedAt: serverTimestamp(),
// // // //         updatedBy: user.uid
// // // //       }, { merge: true });

// // // //       if (status === 'accepted') {
// // // //         // Add to members
// // // //         const memberRef = doc(db, 'projects', projectId, 'members', request.userId);
// // // //         await setDoc(memberRef, {
// // // //           userId: request.userId,
// // // //           displayName: request.userName,
// // // //           email: request.userEmail,
// // // //           joinedAt: serverTimestamp(),
// // // //           avatar: request.avatar || null
// // // //         });

// // // //         // Create acceptance notification
// // // //         const notificationRef = doc(collection(db, 'notifications'));
// // // //         await setDoc(notificationRef, {
// // // //           id: notificationRef.id,
// // // //           type: 'joinRequestAccepted',
// // // //           recipientId: request.userId,
// // // //           recipientUserId: request.userId, // For compatibility with Notification type
// // // //           senderId: user.uid,
// // // //           senderUserId: user.uid, // For compatibility with Notification type
// // // //           senderName: profile.displayName,
// // // //           projectId,
// // // //           projectTitle,
// // // //           contentId: projectId, // For compatibility with Notification type
// // // //           contentType: 'projects', // For compatibility with Notification type
// // // //           status: 'accepted',
// // // //           read: false,
// // // //           createdAt: serverTimestamp(),
// // // //         });
// // // //       } else {
// // // //         // Create rejection notification
// // // //         const notificationRef = doc(collection(db, 'notifications'));
// // // //         await setDoc(notificationRef, {
// // // //           id: notificationRef.id,
// // // //           type: 'joinRequestRejected',
// // // //           recipientId: request.userId,
// // // //           recipientUserId: request.userId, // For compatibility with Notification type
// // // //           senderId: user.uid,
// // // //           senderUserId: user.uid, // For compatibility with Notification type
// // // //           senderName: profile.displayName,
// // // //           projectId,
// // // //           projectTitle,
// // // //           contentId: projectId, // For compatibility with Notification type
// // // //           contentType: 'projects', // For compatibility with Notification type
// // // //           status: 'rejected',
// // // //           read: false,
// // // //           createdAt: serverTimestamp(),
// // // //         });
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error handling request decision:", error);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const formatDate = (timestamp: Date | Timestamp) => {
// // // //     const date = timestamp instanceof Date ? timestamp : new Date(timestamp.toDate?.() || timestamp);
// // // //     return date.toLocaleDateString(undefined, {
// // // //       year: 'numeric',
// // // //       month: 'short',
// // // //       day: 'numeric'
// // // //     });
// // // //   };

// // // //   return (
// // // //     <div className="border rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
// // // //       <div className="flex justify-between items-start">
// // // //         <div className="flex items-center gap-3">
// // // //           {request.avatar && (
// // // //             <img 
// // // //               src={request.avatar} 
// // // //               alt={request.userName}
// // // //               className="w-10 h-10 rounded-full object-cover" 
// // // //             />
// // // //           )}
// // // //           <div>
// // // //             <p className="font-medium">{request.userName}</p>
// // // //             <p className="text-gray-600 text-sm">{request.userEmail}</p>
// // // //             <p className="text-gray-500 text-xs mt-1">
// // // //               {formatDate(request.timestamp)}
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //         <div className="flex gap-2">
// // // //           <button
// // // //             onClick={() => handleDecision('accepted')}
// // // //             disabled={loading}
// // // //             className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
// // // //           >
// // // //             Accept
// // // //           </button>
// // // //           <button
// // // //             onClick={() => handleDecision('rejected')}
// // // //             disabled={loading}
// // // //             className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
// // // //           >
// // // //             Reject
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Join Button Component
// // // // export function JoinButton({ 
// // // //   projectId, 
// // // //   creatorId,
// // // //   projectTitle
// // // // }: { 
// // // //   projectId: string; 
// // // //   creatorId: string;
// // // //   projectTitle: string;
// // // // }) {
// // // //   const { user, profile } = useAuth();
// // // //   const [loading, setLoading] = useState(false);

// // // //   const handleJoinRequest = async () => {
// // // //     if (!user || !profile) return;
// // // //     setLoading(true);
    
// // // //     try {
// // // //       // Create a reference to add a new document with auto-ID
// // // //       const requestRef = collection(db, 'projects', projectId, 'joinRequests');
// // // //       const newRequestRef = doc(requestRef);
      
// // // //       // Add the join request
// // // //       await setDoc(newRequestRef, {
// // // //         id: newRequestRef.id,
// // // //         userId: user.uid,
// // // //         userName: profile.displayName || 'Anonymous',
// // // //         userEmail: profile.email || '',
// // // //         avatar: profile.avatar || null,
// // // //         status: 'pending',
// // // //         timestamp: serverTimestamp()
// // // //       });

// // // //       // Create notification for project creator
// // // //       const notificationRef = doc(collection(db, 'notifications'));
// // // //       await setDoc(notificationRef, {
// // // //         id: notificationRef.id,
// // // //         type: 'joinRequest',
        
// // // //         // Ensure all fields have valid values
// // // //         recipientId: creatorId || '',
// // // //         recipientUserId: creatorId || '', 
// // // //         senderId: user.uid || '',
// // // //         senderUserId: user.uid || '', 
// // // //         senderName: profile.displayName || 'Anonymous',
// // // //         userEmail: profile.email || '',
// // // //         userAvatar: profile.avatar || null,
        
// // // //         projectId: projectId || '',
// // // //         projectTitle: projectTitle || 'Untitled Project',
        
// // // //         // Ensure these fields have default values
// // // //         contentId: projectId || '',
// // // //         contentType: 'projects',
        
// // // //         read: false,
// // // //         createdAt: serverTimestamp()
// // // //       });
// // // //     } catch (error) {
// // // //       console.error("Error sending join request:", error);
// // // //       // Optionally, show an error message to the user
// // // //       alert('Failed to send join request. Please try again.');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <button
// // // //       onClick={handleJoinRequest}
// // // //       disabled={loading}
// // // //       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
// // // //     >
// // // //       {loading ? 'Sending Request...' : 'Join Project'}
// // // //     </button>
// // // //   );
// // // // }
// // // // // Member Section Component
// // // // function MemberSection({ members }: { members: MemberData[] }) {
// // // //   const formatDate = (timestamp: Date | Timestamp) => {
// // // //     const date = timestamp instanceof Date ? timestamp : new Date(timestamp.toDate?.() || timestamp);
// // // //     return date.toLocaleDateString();
// // // //   };

// // // //   return (
// // // //     <div className="mb-8">
// // // //       <h2 className="text-xl font-bold mb-4">Project Members ({members.length})</h2>
// // // //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
// // // //         {members.map(member => (
// // // //           <div key={member.userId} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
// // // //             {/* <img 
// // // //               src={member.avatar || '/default-avatar.png'} 
// // // //               className="w-12 h-12 rounded-full object-cover"
// // // //               alt={member.displayName}
// // // //             /> */}
// // // //             <div>
// // // //               <p className="font-medium">{member.displayName}</p>
// // // //               <p className="text-gray-600 text-sm">{member.email}</p>
// // // //               <p className="text-gray-500 text-xs mt-1">
// // // //                 Joined {formatDate(member.joinedAt)}
// // // //               </p>
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Contribution Item Component
// // // // function ContributionItem({ contribution }: { contribution: Contribution }) {
// // // //   const formatDate = (timestamp: Date | Timestamp) => {
// // // //     const date = timestamp instanceof Date ? timestamp : new Date(timestamp.toDate?.() || timestamp);
// // // //     return date.toLocaleDateString(undefined, {
// // // //       year: 'numeric',
// // // //       month: 'short',
// // // //       day: 'numeric',
// // // //       hour: '2-digit',
// // // //       minute: '2-digit'
// // // //     });
// // // //   };
  
// // // //   return (
// // // //     <div className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
// // // //       <div className="flex justify-between items-start mb-3">
// // // //         <div className="flex items-center gap-3">
// // // //           <img 
// // // //             src={contribution.userAvatar || '/default-avatar.png'} 
// // // //             className="w-10 h-10 rounded-full object-cover"
// // // //             alt={contribution.userName}
// // // //           />
// // // //           <div>
// // // //             <h3 className="font-medium">{contribution.userName}</h3>
// // // //             <p className="text-gray-500 text-xs">{formatDate(contribution.createdAt)}</p>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //       <div className="prose prose-sm max-w-none">
// // // //         <p className="whitespace-pre-line">{contribution.text}</p>
// // // //       </div>
// // // //       {contribution.links && contribution.links.length > 0 && (
// // // //         <div className="mt-3 pt-3 border-t">
// // // //           <p className="text-sm font-medium mb-2">Shared Links:</p>
// // // //           <div className="flex flex-wrap gap-3">
// // // //             {contribution.links.map((link, index) => (
// // // //               <a
// // // //                 key={index}
// // // //                 href={link.url}
// // // //                 target="_blank"
// // // //                 rel="noopener noreferrer"
// // // //                 className="text-blue-600 text-sm bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
// // // //               >
// // // //                 {link.title}
// // // //               </a>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }



// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import { useAuth } from '@/context/AuthContext';
// // // import { 
// // //   doc, 
// // //   getDoc, 
// // //   updateDoc, 
// // //   addDoc, 
// // //   collection, 
// // //   query, 
// // //   where, 
// // //   getDocs,
// // //   serverTimestamp
// // // } from 'firebase/firestore';
// // // import { db } from '@/lib/firebase';
// // // import ProjectJoinList from './ProjectJoinList';
// // // import ContributionBox from './ContributionBox';
// // // import { Project, Contribution, JoinRequest } from '@/types/content';

// // // export default function ProjectDetailPage({ projectId }: { projectId: string }) {
// // //   const { user } = useAuth();
// // //   const [project, setProject] = useState<Project | null>(null);
// // //   const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
// // //   const [contributions, setContributions] = useState<Contribution[]>([]);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     const fetchProjectDetails = async () => {
// // //       if (!projectId) return;

// // //       try {
// // //         // Fetch project details
// // //         const projectDoc = await getDoc(doc(db, 'projects', projectId));
// // //         if (projectDoc.exists()) {
// // //           setProject({ id: projectDoc.id, ...projectDoc.data() } as Project);
// // //         }

// // //         // Fetch join requests
// // //         const joinRequestsQuery = query(
// // //           collection(db, 'joinRequests'), 
// // //           where('projectId', '==', projectId)
// // //         );
// // //         const joinRequestsSnapshot = await getDocs(joinRequestsQuery);
// // //         const fetchedJoinRequests = joinRequestsSnapshot.docs.map(doc => 
// // //           ({ id: doc.id, ...doc.data() } as JoinRequest)
// // //         );
// // //         setJoinRequests(fetchedJoinRequests);

// // //         // Fetch contributions
// // //         const contributionsQuery = query(
// // //           collection(db, 'contributions'), 
// // //           where('projectId', '==', projectId)
// // //         );
// // //         const contributionsSnapshot = await getDocs(contributionsQuery);
// // //         const fetchedContributions = contributionsSnapshot.docs.map(doc => 
// // //           ({ id: doc.id, ...doc.data() } as Contribution)
// // //         );
// // //         setContributions(fetchedContributions);

// // //         setLoading(false);
// // //       } catch (error) {
// // //         console.error('Error fetching project details:', error);
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchProjectDetails();
// // //   }, [projectId]);

// // //   const handleJoinRequest = async () => {
// // //     if (!user || !project) return;

// // //     try {
// // //       await addDoc(collection(db, 'joinRequests'), {
// // //         projectId: project.id,
// // //         userId: user.uid,
// // //         status: 'pending',
// // //         createdAt: serverTimestamp()
// // //       });
// // //       // Optionally, show a success message
// // //     } catch (error) {
// // //       console.error('Error sending join request:', error);
// // //     }
// // //   };

// // //   const handleJoinRequestResponse = async (requestId: string, status: 'accepted' | 'rejected') => {
// // //     try {
// // //       await updateDoc(doc(db, 'joinRequests', requestId), { 
// // //         status,
// // //         updatedAt: serverTimestamp()
// // //       });

// // //       // If accepted, update project members
// // //       if (status === 'accepted') {
// // //         const request = joinRequests.find(req => req.id === requestId);
// // //         if (request && project) {
// // //           await updateDoc(doc(db, 'projects', project.id), {
// // //             currentMembers: [...(project.currentMembers || []), request.userId]
// // //           });
// // //         }
// // //       }

// // //       // Refresh join requests
// // //       const updatedRequests = joinRequests.map(req => 
// // //         req.id === requestId ? { ...req, status } : req
// // //       );
// // //       setJoinRequests(updatedRequests);
// // //     } catch (error) {
// // //       console.error('Error handling join request:', error);
// // //     }
// // //   };

// // //   if (loading) return <div>Loading...</div>;
// // //   if (!project) return <div>Project not found</div>;

// // //   return (
// // //     <div className="max-w-4xl mx-auto p-4">
// // //       <div className="grid md:grid-cols-2 gap-6">
// // //         {/* Project Details Column */}
// // //         <div>
// // //           <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
// // //           <img 
// // //             src={project.imageUrl} 
// // //             alt={project.title} 
// // //             className="w-full h-64 object-cover rounded-lg mb-4" 
// // //           />
// // //           <p className="mb-4">{project.description}</p>

// // //           {/* Project Links */}
// // //           <div className="mb-4">
// // //             <h2 className="text-xl font-semibold mb-2">Project Links</h2>
// // //             {project.links?.map((link, index) => (
// // //               <a 
// // //                 key={index} 
// // //                 href={link.url} 
// // //                 target="_blank" 
// // //                 rel="noopener noreferrer"
// // //                 className="block text-blue-600 hover:underline"
// // //               >
// // //                 {link.title}
// // //               </a>
// // //             ))}
// // //           </div>

// // //           {/* Join Project Button */}
// // //           {user && project.authorId !== user.uid && (
// // //             <button 
// // //               onClick={handleJoinRequest}
// // //               className="bg-green-500 text-white px-4 py-2 rounded"
// // //             >
// // //               Request to Join
// // //             </button>
// // //           )}
// // //         </div>

// // //         {/* Project Management Column */}
// // //         <div>
// // //           {/* Join Requests List */}
// // //           {project.authorId === user?.uid && (
// // //             <ProjectJoinList 
// // //               joinRequests={joinRequests}
// // //               onRequestResponse={handleJoinRequestResponse}
// // //             />
// // //           )}

// // //           {/* Contributions Section */}
// // //           <ContributionBox 
// // //             projectId={project.id}
// // //             currentMembers={project.currentMembers || []}
// // //           />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }






// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { 
// //   doc, 
// //   getDoc, 
// //   collection, 
// //   query, 
// //   where, 
// //   getDocs,
// //   updateDoc,
// //   addDoc,
// //   serverTimestamp
// // } from 'firebase/firestore';
// // import { useAuth } from '@/context/AuthContext';
// // import { db } from '@/lib/firebase';
// // import { 
// //   Project, 
// //   ProjectMember, 
// //   Task, 
// //   Milestone, 
// //   Discussion,
// //   MemberRole,
// //   TaskStatus,
// //   TaskPriority
// // } from '@/types/project';
// // import ProjectJoinRequestsList from './ProjectJoinRequestsList';
// // import ContributionBox from './ContributionBox';
// // // import TaskBoard from './TaskBoard';

// // export default function ProjectDetailPage({ projectId }: { projectId: string }) {
// //   const { user } = useAuth();
// //   const [project, setProject] = useState<Project | null>(null);
// //   const [members, setMembers] = useState<ProjectMember[]>([]);
// //   const [tasks, setTasks] = useState<Task[]>([]);
// //   const [milestones, setMilestones] = useState<Milestone[]>([]);
// //   const [discussions, setDiscussions] = useState<Discussion[]>([]);
// //   const [userRole, setUserRole] = useState<MemberRole | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchProjectDetails = async () => {
// //       if (!projectId || !user) return;

// //       try {
// //         // Fetch Project Details
// //         const projectDoc = await getDoc(doc(db, 'projects', projectId));
// //         if (projectDoc.exists()) {
// //           setProject({ 
// //             id: projectDoc.id, 
// //             ...projectDoc.data() 
// //           } as Project);
// //         }

// //         // Fetch Project Members
// //         const membersQuery = query(
// //           collection(db, 'projectMembers'), 
// //           where('projectId', '==', projectId)
// //         );
// //         const membersSnapshot = await getDocs(membersQuery);
// //         const fetchedMembers = membersSnapshot.docs.map(doc => 
// //           ({ id: doc.id, ...doc.data() } as ProjectMember)
// //         );
// //         setMembers(fetchedMembers);

// //         // Determine User's Role
// //         const userMember = fetchedMembers.find(m => m.userId === user.uid);
// //         if (userMember) {
// //           setUserRole(userMember.role);
// //         }

// //         // Fetch Tasks
// //         const tasksQuery = query(
// //           collection(db, 'tasks'), 
// //           where('projectId', '==', projectId)
// //         );
// //         const tasksSnapshot = await getDocs(tasksQuery);
// //         const fetchedTasks = tasksSnapshot.docs.map(doc => 
// //           ({ id: doc.id, ...doc.data() } as Task)
// //         );
// //         setTasks(fetchedTasks);

// //         // Fetch Milestones
// //         const milestonesQuery = query(
// //           collection(db, 'milestones'), 
// //           where('projectId', '==', projectId)
// //         );
// //         const milestonesSnapshot = await getDocs(milestonesQuery);
// //         const fetchedMilestones = milestonesSnapshot.docs.map(doc => 
// //           ({ id: doc.id, ...doc.data() } as Milestone)
// //         );
// //         setMilestones(fetchedMilestones);

// //         // Fetch Discussions
// //         const discussionsQuery = query(
// //           collection(db, 'discussions'), 
// //           where('projectId', '==', projectId)
// //         );
// //         const discussionsSnapshot = await getDocs(discussionsQuery);
// //         const fetchedDiscussions = discussionsSnapshot.docs.map(doc => 
// //           ({ id: doc.id, ...doc.data() } as Discussion)
// //         );
// //         setDiscussions(fetchedDiscussions);

// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching project details:', error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchProjectDetails();
// //   }, [projectId, user]);

// //   const handleSendJoinRequest = async () => {
// //     if (!user || !project) return;

// //     try {
// //       await addDoc(collection(db, 'joinRequests'), {
// //         projectId: project.id,
// //         userId: user.uid,
// //         status: 'pending',
// //         requestedAt: serverTimestamp()
// //       });
// //       // TODO: Add success notification
// //     } catch (error) {
// //       console.error('Error sending join request:', error);
// //       // TODO: Add error notification
// //     }
// //   };

// //   if (loading) return <div>Loading project details...</div>;
// //   if (!project) return <div>Project not found</div>;

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <div className="grid md:grid-cols-3 gap-6">
// //         {/* Project Overview Column */}
// //         <div className="md:col-span-2">
// //           <div className="bg-white shadow-md rounded-lg p-6">
// //             <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            
// //             {project.imageUrl && (
// //               <img 
// //                 src={project.imageUrl} 
// //                 alt={project.title} 
// //                 className="w-full h-64 object-cover rounded-lg mb-4"
// //               />
// //             )}

// //             <p className="text-gray-700 mb-4">{project.description}</p>

// //             <div className="flex items-center space-x-2 mb-4">
// //               <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
// //                 {project.category}
// //               </span>
// //               <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
// //                 {project.stage}
// //               </span>
// //             </div>

// //             <div className="mb-4">
// //               <h3 className="font-semibold mb-2">Project Tags</h3>
// //               <div className="flex flex-wrap gap-2">
// //                 {project.tags?.map((tag, index) => (
// //                   <span 
// //                     key={index} 
// //                     className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
// //                   >
// //                     {tag}
// //                   </span>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Task Board */}
// //           <div className="mt-6">
// //             {/* <TaskBoard 
// //               projectId={projectId} 
// //               tasks={tasks}
// //               userRole={userRole}
// //             /> */}
// //           </div>
// //         </div>

// //         {/* Project Management Column */}
// //         <div className="space-y-6">
// //           {/* Project Members */}
// //           <div className="bg-white shadow-md rounded-lg p-6">
// //             <h2 className="text-xl font-semibold mb-4">Project Team</h2>
// //             <div className="space-y-2">
// //               {members.map(member => (
// //                 <div 
// //                   key={member.userId} 
// //                   className="flex items-center justify-between"
// //                 >
// //                   <span>{member.userId}</span>
// //                   <span className="text-sm text-gray-500">{member.role}</span>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Join Project Button */}
// //             {user && !members.some(m => m.userId === user.uid) && (
// //               <button 
// //                 onClick={handleSendJoinRequest}
// //                 className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600"
// //               >
// //                 Request to Join
// //               </button>
// //             )}
// //           </div>

// //           {/* Join Requests (for project owners/admins) */}
// //           {userRole === MemberRole.OWNER || userRole === MemberRole.ADMIN ? (
// //             <ProjectJoinRequestsList projectId={projectId} />
// //           ) : null}

// //           {/* Contribution Box (for project members) */}
// //           {members.some(m => m.userId === user?.uid) && (
// //             <ContributionBox 
// //               projectId={projectId} 
// //               userRole={userRole}
// //             />
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }






// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { toast, Toaster } from "react-hot-toast";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   addDoc,
//   collection,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { useAuth } from "@/context/AuthContext";

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { 
//   Tooltip, 
//   TooltipContent, 
//   TooltipProvider, 
//   TooltipTrigger 
// } from "@/components/ui/tooltip";
// import { 
//   HoverCard, 
//   HoverCardContent, 
//   HoverCardTrigger 
// } from "@/components/ui/hover-card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";

// import { 
//   UserPlus, 
//   Edit, 
//   Link as LinkIcon, 
//   CheckCircle, 
//   XCircle, 
//   Users, 
//   Info 
// } from "lucide-react";

// import { ProjectContributionBox } from "./ProjectContributionBox";
// import { JoinRequestNotification } from "./JoinRequestNotification";
// import { ProjectEditModal } from "./ProjectEditModal";

// import { JoinRequest, Project } from "@/types/content";
// import { cn } from "@/lib/utils";

// export default function ProjectDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
//   const [project, setProject] = useState<Project | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isOwner, setIsOwner] = useState(false);
//   const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       if (!id) return;

//       try {
//         const projectDoc = await getDoc(doc(db, "projects", id));
//         if (projectDoc.exists()) {
//           const projectData = { id: projectDoc.id, ...projectDoc.data() } as Project;
//           setProject(projectData);
//           setIsOwner(projectData.ownerId === user?.uid);

//           // Fetch join requests
//           const requestsQuery = query(
//             collection(db, "joinRequests"),
//             where("projectId", "==", id)
//           );
//           const requestsSnapshot = await getDocs(requestsQuery);
//           const requests = requestsSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           })) as JoinRequest[];
//           setJoinRequests(requests);
//         }
//       } catch (error) {
//         console.error("Error fetching project details:", error);
//         toast.error("Failed to load project details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjectDetails();
//   }, [id, user]);

//   const handleJoinRequest = async () => {
//     if (!user || !project) return;

//     try {
//       await addDoc(collection(db, "joinRequests"), {
//         projectId: id,
//         userId: user.uid,
//         userName: user.displayName || user.email,
//         status: "pending",
//         createdAt: new Date(),
//       });
//       toast.success("Join request sent successfully!");
//     } catch (error) {
//       console.error("Error sending join request:", error);
//       toast.error("Failed to send join request");
//     }
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
//     </div>
//   );

//   if (!project) return (
//     <div className="flex justify-center items-center h-screen text-red-500">
//       Project not found
//     </div>
//   );

//   return (
//     <TooltipProvider>
//       <Toaster position="top-right" />
//       <div className="container mx-auto p-6">
//         <Card className="shadow-lg">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <div>
//               <CardTitle className="text-2xl font-bold">{project.title}</CardTitle>
//               <CardDescription className="flex items-center mt-2">
//                 <Info className="mr-2 h-4 w-4 text-muted-foreground" />
//                 {project.category} Project
//               </CardDescription>
//             </div>
//             {isOwner && (
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <ProjectEditModal
//                     project={project}
//                     onUpdate={(updatedProject) => setProject(updatedProject)}
//                   />
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Edit Project Details</p>
//                 </TooltipContent>
//               </Tooltip>
//             )}
//           </CardHeader>
//           <CardContent>
//             <div className="grid md:grid-cols-3 gap-6">
//               {/* Project Overview */}
//               <div className="md:col-span-2">
//                 <div className="relative">
//                   <img
//                     src={project.imageUrl || "/placeholder-project.jpg"}
//                     alt={project.title}
//                     className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
//                   />
//                 </div>
                
//                 <h2 className="text-xl font-semibold mb-2 flex items-center">
//                   <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> 
//                   Description
//                 </h2>
//                 <p className="text-muted-foreground">{project.description}</p>

//                 {/* Project Links */}
//                 {project.links && project.links.length > 0 && (
//                   <div className="mt-6">
//                     <h3 className="font-semibold mb-2 flex items-center">
//                       <LinkIcon className="mr-2 h-5 w-5 text-blue-500" />
//                       Project Links
//                     </h3>
//                     <ScrollArea className="h-24 w-full rounded-md border p-4">
//                       {project.links.map((link, index) => (
//                         <div key={index} className="mb-2">
//                           <a
//                             href={link.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:underline flex items-center"
//                           >
//                             <LinkIcon className="mr-2 h-4 w-4" />
//                             {link.title}
//                           </a>
//                           <Separator className="my-2" />
//                         </div>
//                       ))}
//                     </ScrollArea>
//                   </div>
//                 )}
//               </div>

//               {/* Project Details Sidebar */}
//               <div className="space-y-6">
//                 <HoverCard>
//                   <HoverCardTrigger asChild>
//                     <div>
//                       <h3 className="font-semibold flex items-center mb-2">
//                         <Users className="mr-2 h-5 w-5 text-purple-500" /> 
//                         Team Members
//                       </h3>
//                       <div className="flex -space-x-2">
//                         {project.currentMembers?.map((memberId) => (
//                           <Avatar key={memberId} className="border-2 border-white">
//                             <AvatarImage src={`/user-avatars/${memberId}.jpg`} />
//                             <AvatarFallback>M</AvatarFallback>
//                           </Avatar>
//                         ))}
//                       </div>
//                     </div>
//                   </HoverCardTrigger>
//                   <HoverCardContent className="w-80">
//                     <div className="flex justify-between space-x-4">
//                       <div className="space-y-1">
//                         <h4 className="text-sm font-semibold">Team Composition</h4>
//                         <p className="text-sm text-muted-foreground">
//                           Total Members: {project.teamSize}
//                         </p>
//                       </div>
//                     </div>
//                   </HoverCardContent>
//                 </HoverCard>

//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="font-semibold mb-2">Project Category</h3>
//                     <Badge variant="secondary">{project.category}</Badge>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-2">Team Size</h3>
//                     <p className="text-muted-foreground">{project.teamSize} Members</p>
//                   </div>

//                   {/* Join Project Button */}
//                   {!isOwner && (
//                     <Button 
//                       onClick={handleJoinRequest} 
//                       className="w-full"
//                       variant="default"
//                     >
//                       <UserPlus className="mr-2 h-5 w-5" />
//                       Request to Join
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Tabs for Additional Content */}
//             <Tabs defaultValue="contributions" className="mt-8">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="contributions">Contributions</TabsTrigger>
//                 <TabsTrigger value="joinRequests">Join Requests</TabsTrigger>
//               </TabsList>
//               <TabsContent value="contributions">
//                 <ProjectContributionBox
//                   projectId={id}
//                   isTeamMember={project.currentMembers?.includes(user?.uid || "")}
//                 />
//               </TabsContent>
//               <TabsContent value="joinRequests">
//                 {isOwner && (
//                   <JoinRequestNotification
//                     projectId={id}
//                     joinRequests={joinRequests}
//                   />
//                 )}
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </TooltipProvider>
//   );
// }









"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { arrayUnion } from "firebase/firestore";
import { 
  UserPlus, 
  Edit, 
  Link as LinkIcon, 
  CheckCircle, 
  XCircle, 
  Users, 
  Info,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  BookmarkPlus,
  ExternalLink,
  Tag,
  UserCheck,
  HandHelping,
  Layers,
  PieChart,
  Github,
  Globe,
  Briefcase
} from "lucide-react";

import { ProjectContributionBox } from "./ProjectContributionBox";
import { JoinRequestNotification } from "./JoinRequestNotification";
import { ProjectEditModal } from "./ProjectEditModal";

import { JoinRequest, Project } from "@/types/content";
import { cn } from "@/lib/utils";

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [requestSent, setRequestSent] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (project) {
      // Simulate project progress with random value
      const timer = setTimeout(() => {
        setProgressValue(Math.floor(Math.random() * 100));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [project]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;

      try {
        const projectDoc = await getDoc(doc(db, "projects", id));
        if (projectDoc.exists()) {
          const projectData = { id: projectDoc.id, ...projectDoc.data() } as Project;
          setProject(projectData);
          
          if (user) {
            // Check if user is owner
            setIsOwner(projectData.ownerId === user.uid);
            
            // Check if user is a team member
            setIsTeamMember(projectData.currentMembers?.includes(user.uid) || false);
            
            // Check if user has already sent a request
            if (!isOwner && !isTeamMember) {
              const userRequestQuery = query(
                collection(db, "joinRequests"),
                where("projectId", "==", id),
                where("userId", "==", user.uid)
              );
              const userRequestSnapshot = await getDocs(userRequestQuery);
              setRequestSent(!userRequestSnapshot.empty);
            }
            
            // Check if user has bookmarked this project
            const bookmarkQuery = query(
              collection(db, "bookmarks"),
              where("userId", "==", user.uid),
              where("projectId", "==", id)
            );
            const bookmarkSnapshot = await getDocs(bookmarkQuery);
            setBookmarked(!bookmarkSnapshot.empty);
          }

          // Fetch join requests if user is owner
          if (projectData.ownerId === user?.uid) {
            const requestsQuery = query(
              collection(db, "joinRequests"),
              where("projectId", "==", id)
            );
            const requestsSnapshot = await getDocs(requestsQuery);
            const requests = requestsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as JoinRequest[];
            setJoinRequests(requests);
          }
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, user]);

  const handleJoinRequest = async () => {
    if (!user || !project) return;

    try {
      toast.loading("Sending request...");
      await addDoc(collection(db, "joinRequests"), {
        projectId: id,
        userId: user.uid,
        userName: user.displayName || user.email,
        userPhotoURL: user.photoURL,
        status: "pending",
        message: "",
        createdAt: serverTimestamp(),
      });
      setRequestSent(true);
      toast.dismiss();
      toast.success("Join request sent successfully!");
    } catch (error) {
      console.error("Error sending join request:", error);
      toast.dismiss();
      toast.error("Failed to send join request");
    }
  };

  const handleAcceptRequest = async (request: JoinRequest) => {
    try {
      // Update join request status
      await updateDoc(doc(db, "joinRequests", request.id), {
        status: "accepted"
      });
  
      // Add user to project members
      await updateDoc(doc(db, "projects", projectId), {
        currentMembers: arrayUnion(request.userId)
      });
  
      toast.success("Request accepted successfully!");
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    }
  }

  // In JoinRequestNotification component
// In JoinRequestNotification component
const onAccept = async (requestId: string, userId: string) => {
  try {
    toast.loading("Accepting request...");
    // Update request status
    await updateDoc(doc(db, "joinRequests", requestId), {
      status: "accepted"
    });
    
    // Add user to project
    await updateDoc(doc(db, "projects", projectId), {
      currentMembers: arrayUnion(userId)
    });

    // Update local state
    const updatedRequests = joinRequests.filter(req => req.id !== requestId);
    setJoinRequests(updatedRequests);
    
    toast.dismiss();
    toast.success("Successfully added to team!");
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to accept request");
    console.error("Accept error:", error);
  }
};
  

  const handleBookmark = async () => {
    if (!user || !project) return;

    try {
      if (!bookmarked) {
        await addDoc(collection(db, "bookmarks"), {
          userId: user.uid,
          projectId: id,
          createdAt: serverTimestamp(),
        });
        setBookmarked(true);
        toast.success("Project bookmarked!");
      } else {
        const bookmarksQuery = query(
          collection(db, "bookmarks"),
          where("userId", "==", user.uid),
          where("projectId", "==", id)
        );
        const querySnapshot = await getDocs(bookmarksQuery);
        querySnapshot.forEach(async (document) => {
          await updateDoc(doc(db, "bookmarks", document.id), {
            deleted: true,
          });
        });
        setBookmarked(false);
        toast.success("Bookmark removed");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const handleShareProject = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Project link copied to clipboard!");
  };

  if (loading) return (
    <div className="container mx-auto p-6 space-y-4">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-64 w-full rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!project) return (
    <div className="container mx-auto p-6">
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Project not found. The project may have been deleted or you don't have permission to view it.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <TooltipProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: 'green',
              color: '#fff',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: 'red',
              color: '#fff',
            },
          },
        }}
      />
      <div className="container mx-auto p-4 md:p-6">
        {/* Project Header Card */}
        <Card className="shadow-lg border-t-4 border-primary mb-6">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl font-bold">{project.title}</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    <Tag className="h-3 w-3 mr-1" />
                    {project.category}
                  </Badge>
                  {project.isActive && (
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2 flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  Started on {new Date(project.createdAt?.toDate() || Date.now()).toLocaleDateString()}
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                {!isOwner && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleBookmark} 
                        variant="outline" 
                        size="sm"
                      >
                        {bookmarked ? (
                          <Bookmark className="h-4 w-4 text-primary" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{bookmarked ? "Remove bookmark" : "Bookmark project"}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleShareProject} 
                      variant="outline" 
                      size="sm"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share project</p>
                  </TooltipContent>
                </Tooltip>

                {isOwner && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ProjectEditModal
                        project={project}
                        onUpdate={(updatedProject) => {
                          setProject(updatedProject);
                          toast.success("Project updated successfully!");
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit project details</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="w-full">
              <div className="flex items-center mb-2">
                <PieChart className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium">Project Progress</span>
                <span className="ml-auto text-sm font-medium">{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content - Left and Center */}
          <div className="md:col-span-2 space-y-6">
            {/* Project Overview Card */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-primary" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <img
                    src={project.imageUrl || "/placeholder-project.jpg"}
                    alt={project.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {project.teamSize} members
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Info className="mr-2 h-5 w-5 text-blue-500" /> 
                    Description
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
                </div>

                {/* Project requirements or goals */}
                {project.requirements && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> 
                      Project Goals
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {project.requirements.split('\n').map((req, index) => (
                        <li key={index} className="text-muted-foreground">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Links Card */}
            {project.links && project.links.length > 0 && (
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <LinkIcon className="mr-2 h-5 w-5 text-primary" />
                    Project Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                      >
                        {link.url.includes('github') ? (
                          <Github className="h-5 w-5 mr-2 text-slate-700" />
                        ) : link.url.includes('docs') ? (
                          <Briefcase className="h-5 w-5 mr-2 text-slate-700" />
                        ) : (
                          <Globe className="h-5 w-5 mr-2 text-slate-700" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{link.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{link.url}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs for Additional Content */}
            <Tabs defaultValue="contributions" className="shadow-md">
              <TabsList className="w-full grid grid-cols-2 mb-2 h-12 rounded-t-lg bg-muted/50">
                <TabsTrigger 
                  value="contributions"
                  className="data-[state=active]:bg-background/80 rounded-lg transition-all flex items-center h-10 m-1"
                >
                  <HandHelping className="h-4 w-4 mr-2" />
                  Contributions
                </TabsTrigger>
                {isOwner && (
                  <TabsTrigger 
                    value="joinRequests"
                    className="data-[state=active]:bg-background/80 rounded-lg transition-all flex items-center h-10 m-1"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Join Requests
                    {joinRequests.length > 0 && (
                      <Badge variant="destructive" className="ml-2">{joinRequests.length}</Badge>
                    )}
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="contributions" className="p-4 bg-white rounded-b-lg border-t-0">
                <ProjectContributionBox
                  projectId={id}
                  isTeamMember={isTeamMember || isOwner}
                />
              </TabsContent>
              {isOwner && (
                <TabsContent value="joinRequests" className="p-4 bg-white rounded-b-lg border-t-0">
                  <JoinRequestNotification
                    projectId={id}
                    joinRequests={joinRequests}
                    onRequestHandled={(updatedRequests) => {
                      setJoinRequests(updatedRequests);
                      // Potentially update team members count here too
                    }}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Sidebar - Right */}
          <div className="space-y-6">
            {/* Team Members Card */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-purple-500" /> 
                  Team Members
                </CardTitle>
                <CardDescription>
                  {project.currentMembers?.length || 0} of {project.teamSize} positions filled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex flex-wrap gap-1">
                      {project.currentMembers?.map((memberId, index) => (
                        <Avatar key={index} className="border-2 border-white cursor-pointer">
                          <AvatarImage src={`/user-avatars/${memberId}.jpg`} />
                          <AvatarFallback className="bg-primary/10">
                            {index + 1}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {Array(Math.max(0, project.teamSize - (project.currentMembers?.length || 0)))
                        .fill(0)
                        .map((_, index) => (
                          <div 
                            key={`empty-${index}`} 
                            className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center"
                          >
                            <UserPlus className="h-4 w-4 text-muted-foreground/40" />
                          </div>
                        ))
                      }
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Team Composition</h4>
                      <p className="text-sm text-muted-foreground">
                        <Users className="h-3 w-3 inline mr-1" />
                        {project.currentMembers?.length || 0} of {project.teamSize} positions filled
                      </p>
                      {project.teamRoles && (
                        <>
                          <h4 className="text-sm font-semibold">Looking for:</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.teamRoles.split(',').map((role, index) => (
                              <Badge key={index} variant="outline" className="bg-slate-50">
                                {role.trim()}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </CardContent>
              <CardFooter className="pt-0">
                {!isOwner && !isTeamMember && (
                  <Button 
                    onClick={handleJoinRequest} 
                    className="w-full"
                    variant="default"
                    disabled={requestSent}
                  >
                    {requestSent ? (
                      <>
                        <Clock className="mr-2 h-5 w-5" />
                        Request Pending
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Request to Join
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Project Details Card */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Info className="mr-2 h-5 w-5 text-blue-500" /> 
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">Category</h3>
                    <p className="font-medium">{project.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">Team Size</h3>
                    <p className="font-medium">{project.teamSize} Members</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">Created</h3>
                    <p className="font-medium">{new Date(project.createdAt?.toDate() || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">Duration</h3>
                    <p className="font-medium">{project.duration || "Ongoing"}</p>
                  </div>
                </div>

                {project.skills && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.split(',').map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Information Card */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <UserCheck className="mr-2 h-5 w-5 text-green-500" /> 
                  Project Creator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={project.ownerPhotoURL || `/user-avatars/${project.ownerId}.jpg`} />
                    <AvatarFallback className="bg-primary/10">
                      {project.ownerName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.ownerName}</p>
                    <p className="text-sm text-muted-foreground">Project Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Actions Card */}
            {isOwner && (
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Team
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Manage Resources
                  </Button>
                  {project.isActive ? (
                    <Button variant="destructive" className="w-full justify-start">
                      <XCircle className="mr-2 h-4 w-4" />
                      Archive Project
                    </Button>
                  ) : (
                    <Button variant="default" className="w-full justify-start">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Activate Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}