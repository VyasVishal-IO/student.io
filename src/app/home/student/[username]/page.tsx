// // src/app/home/student/[username]/page.tsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { StudentProfile, UserProfile } from '@/types/user';
// import AuthGuard from '@/components/auth/AuthGuard';
// import { EditStudentProfile } from '@/components/profile/EditStudentProfile';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import JoinedCollegesSection from '@/components/college/JoinedCollegesSection';
// import { 
//   Github, Edit, School, MapPin, 
//   Plus, ExternalLink, Share2,
//   Loader
// } from 'lucide-react';
// import { auth, db } from '@/lib/firebase';
// import { collection, query, where, getDocs, onSnapshot, arrayUnion, arrayRemove, runTransaction, doc } from 'firebase/firestore';
// import toast, { Toaster } from 'react-hot-toast';
// import { FiUserCheck, FiUserPlus } from 'react-icons/fi';

// export default function StudentProfilePage() {
//   const { profile } = useAuth();
//   const params = useParams();
//   const router = useRouter();
  
//   // State management
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("posts");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);
//  const [Profile, setProfile] = useState<UserProfile | null>(null);
  
//   const studentProfile = profile as StudentProfile;
//   const currentUser = auth.currentUser;

  
//   // Fetch data and set loading state
//    useEffect(() => {
//      if (!params.id) return;
 
//      // Real-time profile updates
//      const unsubscribe = onSnapshot(
//        doc(db, 'users', params.id as string),
//        (doc) => {
//          if (doc.exists()) {
//            const data = doc.data() as UserProfile;
//            setProfile({ ...data, uid: doc.id });
//            setIsFollowing(data.followers?.includes(currentUser?.uid || ''));
//          } else {
          
//            router.push('/');
//          }
//          setLoading(false);
//        },
//        (error) => {
      
//          setLoading(false);
//        }
//      );
 
//      return () => unsubscribe();
//    }, [params.id, router, currentUser?.uid]);
 
 
//   useEffect(() => {
//     if (!profile?.uid) return;

//     // Simulate loading for demo
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 1000);
    
//     return () => clearTimeout(timer);
//   }, [profile?.uid]);

  

//   // Share profile
//   const shareProfile = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: `${studentProfile?.displayName}'s Profile`,
//         text: `Check out ${studentProfile?.displayName}'s student profile!`,
//         url: window.location.href,
//       })
//       .then(() => toast.success('Profile shared successfully!'))
//       .catch((error) => console.error('Error sharing:', error));
//     } else {
//       // Fallback for browsers that don't support Web Share API
//       navigator.clipboard.writeText(window.location.href)
//         .then(() => toast.success('Profile URL copied to clipboard!'))
//         .catch(() => toast.error('Failed to copy URL'));
//     }
//   };

  

//   // Show loading state
//   if (loading) {
//     return (
//       <AuthGuard requireAuth={true} requireRole="student">
//         <div className="max-w-md mx-auto px-4">
//           <Skeleton className="h-40 w-full rounded-none mb-4" />
//           <Skeleton className="h-20 w-20 rounded-full mx-auto -mt-10 mb-4" />
//           <Skeleton className="h-6 w-32 mx-auto mb-2" />
//           <Skeleton className="h-4 w-48 mx-auto mb-6" />
//           <div className="space-y-2">
//             <Skeleton className="h-8 w-full" />
//             <Skeleton className="h-8 w-full" />
//             <Skeleton className="h-8 w-full" />
//           </div>
//         </div>
//       </AuthGuard>
//     );
//   }


  

//   return (
//     <AuthGuard requireAuth={true} requireRole="student">
//     <div className="max-w-md mx-auto">
//       {/* Global notification system */}
//       <Toaster position="top-right" />
      
//       {/* Header background */}
//       <div className="relative">
//         <div className="h-40 bg-gradient-to-r from-neutral-900 to-neutral-800 w-full">
//           <div className="absolute right-4 bottom-4 text-4xl md:text-4xl text-white">
//             Student.io
//           </div>
//           {/* Edit and Share buttons */}
//           <div className="absolute top-4 right-4 flex space-x-2">
//             <Button 
//               size="icon"
//               variant="secondary"
//               className="rounded-md bg-neutral-200 hover:bg-neutral-300"
//               onClick={() => setIsEditing(true)}
//             >
//               <Edit className="h-5 w-5" />
//             </Button>
//             <Button 
//               size="icon"
//               variant="secondary"
//               className="rounded-md bg-neutral-200 hover:bg-neutral-300"
//               onClick={shareProfile}
//             >
//               <Share2 className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
        
//         <Avatar className="w-20 h-20 rounded-full absolute left-4 -bottom-10 border-4 border-white">
//           <AvatarImage src={studentProfile?.profileImg} />
//           <AvatarFallback className="bg-neutral-200 text-neutral-700">
//             {studentProfile?.displayName?.[0]?.toUpperCase() || "U"}
//           </AvatarFallback>
//         </Avatar>
//       </div>
      
//       {/* Profile Info */}
//       <div className="mt-12 px-4">
//         <h1 className="text-xl font-bold">{studentProfile?.displayName || 'Your Name'}</h1>
//         <p className="text-sm text-neutral-500">I am {studentProfile?.displayName || 'Student'}</p>
        
//         {/* Education & Stats */}
//         <div className="mt-4 space-y-2">
//           {studentProfile?.education && (
//             <div className="flex items-center text-sm text-neutral-600">
//               <School className="h-4 w-4 mr-2" />
//               <span>{studentProfile.education}</span>
//             </div>
//           )}
          
//           {studentProfile?.major && (
//             <div className="flex items-center text-sm text-neutral-600 ml-6">
//               <div className="w-1 h-1 bg-neutral-400 rounded-full mr-2"></div>
//               <span>{studentProfile.major}</span>
//             </div>
//           )}
          
//           <div className="flex items-center space-x-4 text-sm text-neutral-600">
//             <div className="flex gap-6 mt-4">
//               <div className="text-center">
//                 <div className="font-semibold">{profile.followers?.length || 0}</div>
//                 <div className="text-sm text-gray-500">Followers</div>
//               </div>
//               <div className="text-center">
//                 <div className="font-semibold">{profile.following?.length || 0}</div>
//                 <div className="text-sm text-gray-500">Following</div>
//               </div>
//               <div className="text-center">
//                 <div className="font-semibold">
//                   {Object.values(profile.endorsements || {}).reduce((sum, arr) => sum + arr.length, 0)}
//                 </div>
//                 <div className="text-sm text-gray-500">Endorsements</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Skills Section */}
//         <div className="mt-6">
//           <h2 className="text-base font-semibold mb-2">Skills</h2>
//           <div className="flex flex-wrap gap-2">
//             {studentProfile?.skills?.map((skill, i) => (
//               <Badge key={i} variant="outline" className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md font-normal border-neutral-200">
//                 {skill}
//               </Badge>
//             ))}
//             {(!studentProfile?.skills || studentProfile.skills.length === 0) && (
//               <div className="flex items-center justify-center w-full py-4 border border-dashed border-neutral-300 rounded-md">
//                 <Button 
//                   variant="ghost" 
//                   size="sm" 
//                   onClick={() => setIsEditing(true)}
//                   className="text-neutral-500"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Skills
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Connect Section */}
//         <div className="mt-6">
//           <h2 className="text-base font-semibold mb-2">Connect</h2>
//           <div className="flex gap-2">
//             {studentProfile?.github && (
//               <a href={studentProfile.github} target="_blank" rel="noopener noreferrer">
//                 <Button variant="outline" size="icon" className="rounded-md h-10 w-10">
//                   <Github className="h-5 w-5" />
//                 </Button>
//               </a>
//             )}
//             {studentProfile?.linkedin && (
//               <a href={studentProfile.linkedin} target="_blank" rel="noopener noreferrer">
//                 <Button variant="outline" size="icon" className="rounded-md h-10 w-10">
//                   <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//                   </svg>
//                 </Button>
//               </a>
//             )}
//             {(!studentProfile?.github && !studentProfile?.linkedin) && (
//               <div className="flex items-center justify-center w-full py-4 border border-dashed border-neutral-300 rounded-md">
//                 <Button 
//                   variant="ghost" 
//                   size="sm" 
//                   onClick={() => setIsEditing(true)}
//                   className="text-neutral-500"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Social Links
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Joined Colleges Section */}
//         <div className="mt-6">
//           <JoinedCollegesSection userId={profile?.uid} />
//         </div>

//         {/* Profile Tabs */}
//         <div className="mt-6">
//           <Tabs 
//             defaultValue="posts"
//             value={activeTab} 
//             onValueChange={setActiveTab}
//             className="w-full"

            
//           >
//             <TabsList className="grid grid-cols-3 w-full bg-neutral-100">
//               <TabsTrigger 
//                 value="posts"
//                 className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black"
//               >
//                 Posts
//               </TabsTrigger>
//               <TabsTrigger 
//                 value="projects"
//                 className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black"
//               >
//                 Projects
//               </TabsTrigger>
//               <TabsTrigger 
//                 value="notes"
//                 className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black"
//               >
//                 Notes
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="posts" className="py-4">
//               <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
//                 <p>No posts yet</p>
//                 <Button variant="outline" className="mt-2">Create a post</Button>
//               </div>
//             </TabsContent>
            
//             <TabsContent value="projects" className="py-4">
//               <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
//                 <p>No projects yet</p>
//                 <Button variant="outline" className="mt-2">Add a project</Button>
//               </div>
//             </TabsContent>
            
//             <TabsContent value="notes" className="py-4">
//               <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
//                 <p>No notes yet</p>
//                 <Button variant="outline" className="mt-2">Create a note</Button>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>

//       {/* Edit Profile Dialog */}
//       <EditStudentProfile 
//         isOpen={isEditing}
//         onClose={() => setIsEditing(false)}
//         onSave={() => {
//           setIsEditing(false);
//           router.refresh();
//           toast.success('Profile updated successfully!');
//         }}
//       />
//     </div>
//   </AuthGuard>
//   );
// }



// src/app/home/student/[username]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { StudentProfile, UserProfile } from '@/types/user';
import AuthGuard from '@/components/auth/AuthGuard';
import { EditStudentProfile } from '@/components/profile/EditStudentProfile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Github, Edit, School, MapPin, 
  Plus, ExternalLink, Share2,
  Loader
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot, arrayUnion, arrayRemove, runTransaction, doc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { FiUserCheck, FiUserPlus } from 'react-icons/fi';
import JoinedCollegesSection from '@/components/college/JoinedCollegesSection';


export default function StudentProfilePage() {
  const { profile } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
 const [Profile, setProfile] = useState<UserProfile | null>(null);
  
  const studentProfile = profile as StudentProfile;
  const currentUser = auth.currentUser;

  
  // Fetch data and set loading state
   useEffect(() => {
     if (!params.id) return;
 
     // Real-time profile updates
     const unsubscribe = onSnapshot(
       doc(db, 'users', params.id as string),
       (doc) => {
         if (doc.exists()) {
           const data = doc.data() as UserProfile;
           setProfile({ ...data, uid: doc.id });
           setIsFollowing(data.followers?.includes(currentUser?.uid || ''));
         } else {
          
           router.push('/');
         }
         setLoading(false);
       },
       (error) => {
      
         setLoading(false);
       }
     );
 
     return () => unsubscribe();
   }, [params.id, router, currentUser?.uid]);
 
 
  useEffect(() => {
    if (!profile?.uid) return;

    // Simulate loading for demo
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [profile?.uid]);

  

  // Share profile
  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${studentProfile?.displayName}'s Profile`,
        text: `Check out ${studentProfile?.displayName}'s student profile!`,
        url: window.location.href,
      })
      .then(() => toast.success('Profile shared successfully!'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Profile URL copied to clipboard!'))
        .catch(() => toast.error('Failed to copy URL'));
    }
  };

  

  // Show loading state
  if (loading) {
    return (
      <AuthGuard requireAuth={true} requireRole="student">
        <div className="max-w-md mx-auto px-4">
          <Skeleton className="h-40 w-full rounded-none mb-4" />
          <Skeleton className="h-20 w-20 rounded-full mx-auto -mt-10 mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto mb-6" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </AuthGuard>
    );
  }


  

  return (
    <AuthGuard requireAuth={true} requireRole="student">
    <div className="max-w-md mx-auto">
      {/* Global notification system */}
      <Toaster position="top-right" />
      
      {/* Header background */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-neutral-900 to-neutral-800 w-full">
          <div className="absolute right-4 bottom-4 text-4xl md:text-4xl text-white">
            Student.io
          </div>
          {/* Edit and Share buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button 
              size="icon"
              variant="secondary"
              className="rounded-md bg-neutral-200 hover:bg-neutral-300"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button 
              size="icon"
              variant="secondary"
              className="rounded-md bg-neutral-200 hover:bg-neutral-300"
              onClick={shareProfile}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <Avatar className="w-20 h-20 rounded-full absolute left-4 -bottom-10 border-4 border-white">
          <AvatarImage src={studentProfile?.profileImg} />
          <AvatarFallback className="bg-neutral-200 text-neutral-700">
            {studentProfile?.displayName?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* Profile Info */}
      <div className="mt-12 px-4">
        <h1 className="text-xl font-bold">{studentProfile?.displayName || 'Your Name'}</h1>
        <p className="text-sm text-neutral-500">I am {studentProfile?.displayName || 'Student'}</p>
        
        {/* Education & Stats */}
        <div className="mt-4 space-y-2">
          {studentProfile?.education && (
            <div className="flex items-center text-sm text-neutral-600">
              <School className="h-4 w-4 mr-2" />
              <span>{studentProfile.education}</span>
            </div>
          )}
          
          {studentProfile?.major && (
            <div className="flex items-center text-sm text-neutral-600 ml-6">
              <div className="w-1 h-1 bg-neutral-400 rounded-full mr-2"></div>
              <span>{studentProfile.major}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-neutral-600">
            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <div className="font-semibold">{profile.followers?.length || 0}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{profile.following?.length || 0}</div>
                <div className="text-sm text-gray-500">Following</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">
                  {Object.values(profile.endorsements || {}).reduce((sum, arr) => sum + arr.length, 0)}
                </div>
                <div className="text-sm text-gray-500">Endorsements</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <h2 className="text-base font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {studentProfile?.skills?.map((skill, i) => (
              <Badge key={i} variant="outline" className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md font-normal border-neutral-200">
                {skill}
              </Badge>
            ))}
            {(!studentProfile?.skills || studentProfile.skills.length === 0) && (
              <div className="flex items-center justify-center w-full py-4 border border-dashed border-neutral-300 rounded-md">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-neutral-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skills
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Connect Section */}
        <div className="mt-6">
          <h2 className="text-base font-semibold mb-2">Connect</h2>
          <div className="flex gap-2">
            {studentProfile?.github && (
              <a href={studentProfile.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-md h-10 w-10">
                  <Github className="h-5 w-5" />
                </Button>
              </a>
            )}
            {studentProfile?.linkedin && (
              <a href={studentProfile.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-md h-10 w-10">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Button>
              </a>
            )}
            {(!studentProfile?.github && !studentProfile?.linkedin) && (
              <div className="flex items-center justify-center w-full py-4 border border-dashed border-neutral-300 rounded-md">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-neutral-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Social Links
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Joined Colleges Section */}
        <div className="mt-6">
          <JoinedCollegesSection userId={profile?.uid} />
        </div>

        {/* Profile Tabs */}
        <div className="mt-6">
          <Tabs 
            defaultValue="posts"
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full bg-neutral-100">
              <TabsTrigger 
                value="posts"
                className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="projects"
                className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger 
                value="notes"
                className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-black"
              >
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="py-4">
              <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                <p>No posts yet</p>
                <Button variant="outline" className="mt-2">Create a post</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="py-4">
              <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                <p>No projects yet</p>
                <Button variant="outline" className="mt-2">Add a project</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="py-4">
              <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                <p>No notes yet</p>
                <Button variant="outline" className="mt-2">Create a note</Button>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditStudentProfile 
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={() => {
          setIsEditing(false);
          router.refresh();
          toast.success('Profile updated successfully!');
        }}
      />
    </div>
  </AuthGuard>
  
  );
}




