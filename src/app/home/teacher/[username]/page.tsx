// // // src/app/home/teacher/[username]/page.tsx
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import Link from 'next/link';
// // import { useParams, useRouter } from 'next/navigation';
// // import AuthGuard from '@/components/auth/AuthGuard';
// // import { useAuth } from '@/context/AuthContext';
// // import EditTeacherProfile from '@/components/profile/EditTeacherProfile';
// // import CreateCollegeForm from '@/components/college/CreateCollegeForm';
// // import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
// // import { db } from '@/lib/firebase';
// // import { addDoc, serverTimestamp } from 'firebase/firestore';


// // export default function TeacherHomePage() {
// //   const { profile, logout, user } = useAuth();
// //   const params = useParams();
// //   const router = useRouter();
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [showCreateCollege, setShowCreateCollege] = useState(false);
// //   const [colleges, setColleges] = useState<any[]>([]);
// //   const username = params.username as string;
// //   const [notificationCount, setNotificationCount] = useState(0);
// //   const [joinedColleges, setJoinedColleges] = useState<any[]>([]);
// //   const [message, setMessage] = useState('');

// //   // Add this function
// // const sendMessageToStudents = async (collegeId: string) => {
// //   if (!message.trim()) return;

// //   try {
// //     await addDoc(collection(db, 'messages'), {
// //       collegeId,
// //       senderId: user?.uid,
// //       content: message.trim(),
// //       createdAt: serverTimestamp(),
// //       senderName: profile?.displayName
// //     });
// //     setMessage('');
// //     alert('Message sent successfully!');
// //   } catch (error) {
// //     console.error('Error sending message:', error);
// //     alert('Failed to send message');
// //   }
// // };


// //   useEffect(() => {
// //     if (!user?.uid) return;
    
// //     // Query for colleges where teacher is a member - removed orderBy to avoid composite index error
// //     const joinedCollegesQuery = query(
// //       collection(db, 'colleges'),
// //       where('teachers', 'array-contains', user.uid)
// //     );

// //     const unsubscribeJoined = onSnapshot(joinedCollegesQuery, (snapshot) => {
// //       // Sort the data client-side instead of in the query
// //       const collegesData = snapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data()
// //       }));
      
// //       // Sort by createdAt if it exists
// //       collegesData.sort((a, b) => {
// //         if (a.createdAt && b.createdAt) {
// //           return b.createdAt.seconds - a.createdAt.seconds;
// //         }
// //         return 0;
// //       });
      
// //       setJoinedColleges(collegesData);
// //     });

// //     return () => {
// //       unsubscribeJoined();
// //     };
// //   }, [user?.uid]);

// //   useEffect(() => {
// //     if (!user?.uid) return;
    
// //     // Query for all colleges created by this teacher
// //     const fetchColleges = async () => {
// //       const collegesQuery = query(
// //         collection(db, 'colleges'),
// //         where('createdBy', '==', user.uid)
// //       );
      
// //       const collegesSnapshot = await getDocs(collegesQuery);
// //       const collegesData = collegesSnapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data()
// //       }));
      
// //       // Sort by createdAt if it exists
// //       collegesData.sort((a, b) => {
// //         if (a.createdAt && b.createdAt) {
// //           return b.createdAt.seconds - a.createdAt.seconds;
// //         }
// //         return 0;
// //       });
      
// //       setColleges(collegesData);
      
// //       // If we have colleges, set up listeners for join requests
// //       if (collegesSnapshot.docs.length > 0) {
// //         const collegeIds = collegesSnapshot.docs.map(doc => doc.id);
        
// //         const requestsQuery = query(
// //           collection(db, 'requests'),
// //           where('collegeId', 'in', collegeIds),
// //           where('status', '==', 'pending')
// //         );
        
// //         return onSnapshot(requestsQuery, (snapshot) => {
// //           setNotificationCount(snapshot.size);
// //         });
// //       }
// //     };
    
// //     fetchColleges();
// //   }, [user?.uid]);

// //   return (
// //     <AuthGuard requireAuth={true} requireRole="teacher">
// //       <div className="min-h-screen bg-gray-50">
// //         <header className="bg-white shadow">
// //           <div className="flex items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
// //             <h1 className="text-3xl font-bold tracking-tight text-gray-900">Teacher Dashboard</h1>
// //             <div className="flex items-center space-x-4">
// //               <span className="text-gray-700">{profile?.displayName}</span>
// //               <Link
// //                 href={`/teacher/${username}/notifications`}
// //                 className="relative p-2 text-gray-700 hover:text-gray-900"
// //               >
// //                 <span className="flex items-center">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
// //                   </svg>
// //                   Notifications
// //                 </span>
// //                 {notificationCount > 0 && (
// //                   <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
// //                     {notificationCount}
// //                   </span>
// //                 )}
// //               </Link>
// //               <button
// //                 onClick={() => logout()}
// //                 className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
// //               >
// //                 Logout
// //               </button>
// //             </div>
// //           </div>
// //         </header>

// //         <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
// //           {isEditing ? (
// //             <EditTeacherProfile 
// //               onCancel={() => setIsEditing(false)}
// //               onComplete={() => setIsEditing(false)}
// //             />
// //           ) : (
// //             <>
// //               {/* Profile Section */}
// //               <div className="overflow-hidden bg-white shadow sm:rounded-lg">
// //                 <div className="px-4 py-5 sm:px-6">
// //                   <h3 className="text-lg font-medium leading-6 text-gray-900">
// //                     Teacher Profile
// //                   </h3>
// //                   <p className="max-w-2xl mt-1 text-sm text-gray-500">
// //                     Professional details and teaching information.
// //                   </p>
// //                 </div>
// //                 <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
// //                   <dl className="sm:divide-y sm:divide-gray-200">
// //                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
// //                       <dt className="text-sm font-medium text-gray-500">Full name</dt>
// //                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
// //                         {profile?.displayName}
// //                       </dd>
// //                     </div>
// //                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
// //                       <dt className="text-sm font-medium text-gray-500">Username</dt>
// //                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
// //                         {profile?.username}
// //                       </dd>
// //                     </div>
// //                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
// //                       <dt className="text-sm font-medium text-gray-500">Email address</dt>
// //                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
// //                         {profile?.email}
// //                       </dd>
// //                     </div>
// //                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
// //                       <dt className="text-sm font-medium text-gray-500">Department</dt>
// //                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
// //                         {(profile as any)?.department || 'Not specified'}
// //                       </dd>
// //                     </div>
// //                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
// //                       <dt className="text-sm font-medium text-gray-500">Subjects</dt>
// //                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
// //                         {(profile as any)?.subjects?.join(', ') || 'Not specified'}
// //                       </dd>
// //                     </div>
// //                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
// //                       <dt className="text-sm font-medium text-gray-500">Experience (years)</dt>
// //                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
// //                         {(profile as any)?.experience || 'Not specified'}
// //                       </dd>
// //                     </div>
// //                   </dl>
// //                 </div>
// //                 <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
// //                   <button
// //                     type="button"
// //                     onClick={() => setIsEditing(true)}
// //                     className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// //                   >
// //                     Update Profile
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Created Colleges Section */}
// //               <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
// //                 <div className="px-4 py-5 sm:px-6">
// //                   <div className="flex items-center justify-between">
// //                     <h3 className="text-lg font-medium leading-6 text-gray-900">Your Created Colleges</h3>
// //                     <button
// //                       onClick={() => setShowCreateCollege(true)}
// //                       className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
// //                     >
// //                       Create College
// //                     </button>
// //                   </div>
                  
// //                   {showCreateCollege && (
// //                     <CreateCollegeForm 
// //                       onClose={() => setShowCreateCollege(false)}
// //                     />
// //                   )}

// //                   <div className="mt-4">
// //                     {colleges.length === 0 ? (
// //                       <p className="text-gray-500">No colleges created yet.</p>
// //                     ) : (
// //                       <div className="space-y-4">
// //                         {colleges.map((college) => (
// //                           <div
// //                             key={college.id}
// //                             className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
// //                           >
// //                             <Link
// //                               href={`/college/${encodeURIComponent(college.name)}`}
// //                               className="text-lg font-medium text-blue-600 hover:text-blue-800"
// //                             >
// //                               {college.name}
// //                             </Link>
// //                             <p className="mt-1 text-sm text-gray-600">{college.description}</p>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Joined Colleges Section */}
// //               <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
// //                 <div className="px-4 py-5 sm:px-6">
// //                   <h3 className="text-lg font-medium leading-6 text-gray-900">Joined Colleges</h3>
// //                   <div className="mt-4">
// //                     {joinedColleges.length === 0 ? (
// //                       <p className="text-gray-500">You haven't joined any colleges yet.</p>
// //                     ) : (
// //                       <div className="space-y-4">
// //                         {joinedColleges.map((college) => (
// //                           <div
// //                             key={college.id}
// //                             className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
// //                           >
// //                             <Link
// //                               href={`/college/${encodeURIComponent(college.name)}`}
// //                               className="text-lg font-medium text-blue-600 hover:text-blue-800"
// //                             >
// //                               {college.name}
// //                             </Link>
// //                             <p className="mt-1 text-sm text-gray-600">{college.description}</p>
// //                             <div className="mt-2 flex space-x-4">
// //                               {/* <Link
// //                                 href={`/college/${encodeURIComponent(college.name)}/messages`}
// //                                 className="text-sm text-green-600 hover:text-green-800"
// //                               >
// //                                 Send Message to Students
// //                               </Link> */}
// //                               <Link
// //                                 href={`/college/${encodeURIComponent(college.name)}/assignments`}
// //                                 className="text-sm text-blue-600 hover:text-blue-800"
// //                               >
// //                                 Manage Assignments
// //                               </Link>
// //                             </div>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             </>
// //           )}

// // {/* // Add this component in the return section, inside the joined colleges map */}
// // {joinedColleges.map((college) => (
// //   <div key={college.id} className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
// //     {/* Existing college info */}
// //     <div className="mt-4">
// //       <textarea
// //         value={message}
// //         onChange={(e) => setMessage(e.target.value)}
// //         className="w-full p-2 border rounded-md"
// //         rows={3}
// //         placeholder="Write a message for students..."
// //       />
// //       <button
// //         onClick={() => sendMessageToStudents(college.id)}
// //         className="mt-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
// //       >
// //         Send Message
// //       </button>
// //     </div>
// //   </div>
// // ))}
// //         </main>
// //       </div>
// //     </AuthGuard>
// //   );
// // }

// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import AuthGuard from '@/components/auth/AuthGuard';
// import { useAuth } from '@/context/AuthContext';
// import EditTeacherProfile from '@/components/profile/EditTeacherProfile';
// import CreateCollegeForm from '@/components/college/CreateCollegeForm';
// import JoinedColleges from '@/components/college/JoinedColleges';
// import CreatedColleges from '@/components/college/CreatedColleges';
// import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// export default function TeacherHomePage() {
//   const { profile, logout, user } = useAuth();
//   const params = useParams();
//   const [isEditing, setIsEditing] = useState(false);
//   const [showCreateCollege, setShowCreateCollege] = useState(false);
//   const [colleges, setColleges] = useState<any[]>([]);
//   const username = params.username as string;
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [joinedColleges, setJoinedColleges] = useState<any[]>([]);

//   useEffect(() => {
//     if (!user?.uid) return;
    
//     // Query for colleges where teacher is a member
//     const joinedCollegesQuery = query(
//       collection(db, 'colleges'),
//       where('teachers', 'array-contains', user.uid)
//     );

//     const unsubscribeJoined = onSnapshot(joinedCollegesQuery, (snapshot) => {
//       // Sort the data client-side
//       const collegesData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
      
//       collegesData.sort((a, b) => {
//         if (a.createdAt && b.createdAt) {
//           return b.createdAt.seconds - a.createdAt.seconds;
//         }
//         return 0;
//       });
      
//       setJoinedColleges(collegesData);
//     });

//     return () => {
//       unsubscribeJoined();
//     };
//   }, [user?.uid]);

//   useEffect(() => {
//     if (!user?.uid) return;
    
//     // Query for all colleges created by this teacher
//     const fetchColleges = async () => {
//       const collegesQuery = query(
//         collection(db, 'colleges'),
//         where('createdBy', '==', user.uid)
//       );
      
//       const collegesSnapshot = await getDocs(collegesQuery);
//       const collegesData = collegesSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
      
//       collegesData.sort((a, b) => {
//         if (a.createdAt && b.createdAt) {
//           return b.createdAt.seconds - a.createdAt.seconds;
//         }
//         return 0;
//       });
      
//       setColleges(collegesData);
      
//       // If we have colleges, set up listeners for join requests
//       if (collegesSnapshot.docs.length > 0) {
//         const collegeIds = collegesSnapshot.docs.map(doc => doc.id);
        
//         const requestsQuery = query(
//           collection(db, 'requests'),
//           where('collegeId', 'in', collegeIds),
//           where('status', '==', 'pending')
//         );
        
//         return onSnapshot(requestsQuery, (snapshot) => {
//           setNotificationCount(snapshot.size);
//         });
//       }
//     };
    
//     fetchColleges();
//   }, [user?.uid]);

//   return (
//     <AuthGuard requireAuth={true} requireRole="teacher">
//       <div className="min-h-screen bg-gray-50">
//         <header className="bg-white shadow">
//           <div className="flex items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//             <h1 className="text-3xl font-bold tracking-tight text-gray-900">Teacher Dashboard</h1>
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-700">{profile?.displayName}</span>
//               <Link
//                 href={`/teacher/${username}/notifications`}
//                 className="relative p-2 text-gray-700 hover:text-gray-900"
//               >
//                 <span className="flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                   </svg>
//                   Notifications
//                 </span>
//                 {notificationCount > 0 && (
//                   <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
//                     {notificationCount}
//                   </span>
//                 )}
//               </Link>
//               <button
//                 onClick={() => logout()}
//                 className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </header>

//         <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           {isEditing ? (
//             <EditTeacherProfile 
//               onCancel={() => setIsEditing(false)}
//               onComplete={() => setIsEditing(false)}
//             />
//           ) : (
//             <>
//               {/* Profile Section */}
//               <div className="overflow-hidden bg-white shadow sm:rounded-lg">
//                 <div className="px-4 py-5 sm:px-6">
//                   <h3 className="text-lg font-medium leading-6 text-gray-900">
//                     Teacher Profile
//                   </h3>
//                   <p className="max-w-2xl mt-1 text-sm text-gray-500">
//                     Professional details and teaching information.
//                   </p>
//                 </div>
//                 <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
//                   <dl className="sm:divide-y sm:divide-gray-200">
//                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
//                       <dt className="text-sm font-medium text-gray-500">Full name</dt>
//                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
//                         {profile?.displayName}
//                       </dd>
//                     </div>
//                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
//                       <dt className="text-sm font-medium text-gray-500">Username</dt>
//                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
//                         {profile?.username}
//                       </dd>
//                     </div>
//                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
//                       <dt className="text-sm font-medium text-gray-500">Email address</dt>
//                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
//                         {profile?.email}
//                       </dd>
//                     </div>
//                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
//                       <dt className="text-sm font-medium text-gray-500">Department</dt>
//                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
//                         {(profile as any)?.department || 'Not specified'}
//                       </dd>
//                     </div>
//                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
//                       <dt className="text-sm font-medium text-gray-500">Subjects</dt>
//                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
//                         {(profile as any)?.subjects?.join(', ') || 'Not specified'}
//                       </dd>
//                     </div>
//                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
//                       <dt className="text-sm font-medium text-gray-500">Experience (years)</dt>
//                       <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
//                         {(profile as any)?.experience || 'Not specified'}
//                       </dd>
//                     </div>
//                   </dl>
//                 </div>
//                 <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
//                   <button
//                     type="button"
//                     onClick={() => setIsEditing(true)}
//                     className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     Update Profile
//                   </button>
//                 </div>
//               </div>

//               {/* Created Colleges Section */}
//               <CreatedColleges 
//                 colleges={colleges} 
//                 showCreateCollege={showCreateCollege}
//                 setShowCreateCollege={setShowCreateCollege} 
//               />

//               {/* Joined Colleges Section */}
//               <JoinedColleges 
//                 joinedColleges={joinedColleges} 
//                 user={user} 
//               />
//             </>
//           )}
//         </main>
//       </div>
//     </AuthGuard>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Bell, LogOut, Plus, School, Edit, User } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import EditTeacherProfile from '@/components/profile/EditTeacherProfile';
import CreateCollegeForm from '@/components/college/CreateCollegeForm';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function TeacherHomePage() {
  const { profile, logout, user } = useAuth();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateCollege, setShowCreateCollege] = useState(false);
  const [colleges, setColleges] = useState<any[]>([]);
  const username = params.username as string;
  const [notificationCount, setNotificationCount] = useState(0);
  const [joinedColleges, setJoinedColleges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    
    // Query for colleges where teacher is a member
    const joinedCollegesQuery = query(
      collection(db, 'colleges'),
      where('teachers', 'array-contains', user.uid)
    );

    const unsubscribeJoined = onSnapshot(joinedCollegesQuery, (snapshot) => {
      const collegesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      collegesData.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      });
      
      setJoinedColleges(collegesData);
      setIsLoading(false);
    });

    return () => {
      unsubscribeJoined();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    
    // Query for all colleges created by this teacher
    const fetchColleges = async () => {
      try {
        const collegesQuery = query(
          collection(db, 'colleges'),
          where('createdBy', '==', user.uid)
        );
        
        const collegesSnapshot = await getDocs(collegesQuery);
        const collegesData = collegesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        collegesData.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        });
        
        setColleges(collegesData);
        
        // If we have colleges, set up listeners for join requests
        if (collegesSnapshot.docs.length > 0) {
          const collegeIds = collegesSnapshot.docs.map(doc => doc.id);
          
          const requestsQuery = query(
            collection(db, 'requests'),
            where('collegeId', 'in', collegeIds),
            where('status', '==', 'pending')
          );
          
          return onSnapshot(requestsQuery, (snapshot) => {
            setNotificationCount(snapshot.size);
          });
        }
      } catch (error) {
        toast.error("Failed to fetch colleges");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchColleges();
  }, [user?.uid]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (isEditing) {
    return (
      <AuthGuard requireAuth={true} requireRole="teacher">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 py-8 mx-auto">
            <EditTeacherProfile 
              onCancel={() => setIsEditing(false)}
              onComplete={() => {
                setIsEditing(false);
                toast.success("Profile updated successfully");
              }}
            />
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={true} requireRole="teacher">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Toaster position="top-center" />
        
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm dark:bg-gray-800">
          <div className="container px-4 py-4 mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold md:text-2xl text-gray-900 dark:text-white">
                Teacher Dashboard
              </h1>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                <Link
                  href={`/teacher/${username}/notifications`}
                  className="relative p-2 text-gray-700 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0">
                      {notificationCount}
                    </Badge>
                  )}
                </Link>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300"
                >
                  <LogOut size={20} />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container px-4 py-6 mx-auto">
          {/* Profile Card */}
          <div className="mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {profile?.displayName?.charAt(0) || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{profile?.displayName}</CardTitle>
                    <CardDescription>@{profile?.username}</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </Button>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{profile?.email}</span>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {(profile as any)?.department || 'Not specified'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {(profile as any)?.experience ? `${(profile as any)?.experience} years` : 'Not specified'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Subjects</span>
                    <div className="flex flex-wrap gap-1">
                      {(profile as any)?.subjects?.length > 0 ? (
                        (profile as any)?.subjects.map((subject: string, index: number) => (
                          <Badge key={index} variant="secondary">{subject}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-gray-100">Not specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colleges Tabs */}
          <Tabs defaultValue="created" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="created">Created Colleges</TabsTrigger>
              <TabsTrigger value="joined">Joined Colleges</TabsTrigger>
            </TabsList>
            
            {/* Created Colleges Tab */}
            <TabsContent value="created" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Colleges</h2>
                <Dialog open={showCreateCollege} onOpenChange={setShowCreateCollege}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus size={16} className="mr-2" />
                      Create College
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <CreateCollegeForm onSuccess={() => {
                      setShowCreateCollege(false);
                      toast.success("College created successfully");
                    }} />
                  </DialogContent>
                </Dialog>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              ) : colleges.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center pt-8 pb-8">
                    <School size={48} className="text-gray-400 mb-2" />
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      You haven't created any colleges yet.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowCreateCollege(true)}
                    >
                      <Plus size={16} className="mr-2" />
                      Create Your First College
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {colleges.map((college) => (
                      <Card key={college.id} className="flex flex-col">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{college.name}</CardTitle>
                          <CardDescription>
                            {college.description?.length > 100 
                              ? `${college.description.substring(0, 100)}...` 
                              : college.description || 'No description'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center space-x-1">
                            <User size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {college.teachersCount || 0} teachers
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="mt-auto">
                          <Link href={`/college/${college.name}`} passHref>
                            <Button variant="outline" className="w-full">
                              Manage College
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
            
            {/* Joined Colleges Tab */}
            <TabsContent value="joined" className="space-y-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Joined Colleges</h2>
              
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              ) : joinedColleges.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center pt-8 pb-8">
                    <School size={48} className="text-gray-400 mb-2" />
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      You haven't joined any colleges yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {joinedColleges.map((college) => (
                      <Card key={college.id} className="flex flex-col">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{college.name}</CardTitle>
                          <CardDescription>
                            {college.description?.length > 100 
                              ? `${college.description.substring(0, 100)}...` 
                              : college.description || 'No description'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center space-x-1">
                            <User size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {college.teachersCount || 0} teachers
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="mt-auto">
                          <Link href={`/college/${college.name}`} passHref>
                            <Button variant="default" className="w-full">
                              View College
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  );
}