// // src/app/home/teacher/[username]/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import AuthGuard from '@/components/auth/AuthGuard';
// import { useAuth } from '@/context/AuthContext';
// import EditTeacherProfile from '@/components/profile/EditTeacherProfile';
// import CreateCollegeForm from '@/components/college/CreateCollegeForm';
// import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { addDoc, serverTimestamp } from 'firebase/firestore';


// export default function TeacherHomePage() {
//   const { profile, logout, user } = useAuth();
//   const params = useParams();
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [showCreateCollege, setShowCreateCollege] = useState(false);
//   const [colleges, setColleges] = useState<any[]>([]);
//   const username = params.username as string;
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [joinedColleges, setJoinedColleges] = useState<any[]>([]);
//   const [message, setMessage] = useState('');

//   // Add this function
// const sendMessageToStudents = async (collegeId: string) => {
//   if (!message.trim()) return;

//   try {
//     await addDoc(collection(db, 'messages'), {
//       collegeId,
//       senderId: user?.uid,
//       content: message.trim(),
//       createdAt: serverTimestamp(),
//       senderName: profile?.displayName
//     });
//     setMessage('');
//     alert('Message sent successfully!');
//   } catch (error) {
//     console.error('Error sending message:', error);
//     alert('Failed to send message');
//   }
// };


//   useEffect(() => {
//     if (!user?.uid) return;
    
//     // Query for colleges where teacher is a member - removed orderBy to avoid composite index error
//     const joinedCollegesQuery = query(
//       collection(db, 'colleges'),
//       where('teachers', 'array-contains', user.uid)
//     );

//     const unsubscribeJoined = onSnapshot(joinedCollegesQuery, (snapshot) => {
//       // Sort the data client-side instead of in the query
//       const collegesData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
      
//       // Sort by createdAt if it exists
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
      
//       // Sort by createdAt if it exists
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
//               <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
//                 <div className="px-4 py-5 sm:px-6">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-medium leading-6 text-gray-900">Your Created Colleges</h3>
//                     <button
//                       onClick={() => setShowCreateCollege(true)}
//                       className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//                     >
//                       Create College
//                     </button>
//                   </div>
                  
//                   {showCreateCollege && (
//                     <CreateCollegeForm 
//                       onClose={() => setShowCreateCollege(false)}
//                     />
//                   )}

//                   <div className="mt-4">
//                     {colleges.length === 0 ? (
//                       <p className="text-gray-500">No colleges created yet.</p>
//                     ) : (
//                       <div className="space-y-4">
//                         {colleges.map((college) => (
//                           <div
//                             key={college.id}
//                             className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
//                           >
//                             <Link
//                               href={`/college/${encodeURIComponent(college.name)}`}
//                               className="text-lg font-medium text-blue-600 hover:text-blue-800"
//                             >
//                               {college.name}
//                             </Link>
//                             <p className="mt-1 text-sm text-gray-600">{college.description}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Joined Colleges Section */}
//               <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
//                 <div className="px-4 py-5 sm:px-6">
//                   <h3 className="text-lg font-medium leading-6 text-gray-900">Joined Colleges</h3>
//                   <div className="mt-4">
//                     {joinedColleges.length === 0 ? (
//                       <p className="text-gray-500">You haven't joined any colleges yet.</p>
//                     ) : (
//                       <div className="space-y-4">
//                         {joinedColleges.map((college) => (
//                           <div
//                             key={college.id}
//                             className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
//                           >
//                             <Link
//                               href={`/college/${encodeURIComponent(college.name)}`}
//                               className="text-lg font-medium text-blue-600 hover:text-blue-800"
//                             >
//                               {college.name}
//                             </Link>
//                             <p className="mt-1 text-sm text-gray-600">{college.description}</p>
//                             <div className="mt-2 flex space-x-4">
//                               {/* <Link
//                                 href={`/college/${encodeURIComponent(college.name)}/messages`}
//                                 className="text-sm text-green-600 hover:text-green-800"
//                               >
//                                 Send Message to Students
//                               </Link> */}
//                               <Link
//                                 href={`/college/${encodeURIComponent(college.name)}/assignments`}
//                                 className="text-sm text-blue-600 hover:text-blue-800"
//                               >
//                                 Manage Assignments
//                               </Link>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

// {/* // Add this component in the return section, inside the joined colleges map */}
// {joinedColleges.map((college) => (
//   <div key={college.id} className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
//     {/* Existing college info */}
//     <div className="mt-4">
//       <textarea
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         className="w-full p-2 border rounded-md"
//         rows={3}
//         placeholder="Write a message for students..."
//       />
//       <button
//         onClick={() => sendMessageToStudents(college.id)}
//         className="mt-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
//       >
//         Send Message
//       </button>
//     </div>
//   </div>
// ))}
//         </main>
//       </div>
//     </AuthGuard>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import EditTeacherProfile from '@/components/profile/EditTeacherProfile';
import CreateCollegeForm from '@/components/college/CreateCollegeForm';
import JoinedColleges from '@/components/college/JoinedColleges';
import CreatedColleges from '@/components/college/CreatedColleges';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TeacherHomePage() {
  const { profile, logout, user } = useAuth();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateCollege, setShowCreateCollege] = useState(false);
  const [colleges, setColleges] = useState<any[]>([]);
  const username = params.username as string;
  const [notificationCount, setNotificationCount] = useState(0);
  const [joinedColleges, setJoinedColleges] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    
    // Query for colleges where teacher is a member
    const joinedCollegesQuery = query(
      collection(db, 'colleges'),
      where('teachers', 'array-contains', user.uid)
    );

    const unsubscribeJoined = onSnapshot(joinedCollegesQuery, (snapshot) => {
      // Sort the data client-side
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
    });

    return () => {
      unsubscribeJoined();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    
    // Query for all colleges created by this teacher
    const fetchColleges = async () => {
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
    };
    
    fetchColleges();
  }, [user?.uid]);

  return (
    <AuthGuard requireAuth={true} requireRole="teacher">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Teacher Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{profile?.displayName}</span>
              <Link
                href={`/teacher/${username}/notifications`}
                className="relative p-2 text-gray-700 hover:text-gray-900"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                </span>
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => logout()}
                className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {isEditing ? (
            <EditTeacherProfile 
              onCancel={() => setIsEditing(false)}
              onComplete={() => setIsEditing(false)}
            />
          ) : (
            <>
              {/* Profile Section */}
              <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Teacher Profile
                  </h3>
                  <p className="max-w-2xl mt-1 text-sm text-gray-500">
                    Professional details and teaching information.
                  </p>
                </div>
                <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {profile?.displayName}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {profile?.username}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {profile?.email}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Department</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {(profile as any)?.department || 'Not specified'}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Subjects</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {(profile as any)?.subjects?.join(', ') || 'Not specified'}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Experience (years)</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {(profile as any)?.experience || 'Not specified'}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Created Colleges Section */}
              <CreatedColleges 
                colleges={colleges} 
                showCreateCollege={showCreateCollege}
                setShowCreateCollege={setShowCreateCollege} 
              />

              {/* Joined Colleges Section */}
              <JoinedColleges 
                joinedColleges={joinedColleges} 
                user={user} 
              />
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}