// // src/components/college/CollegePosts.tsx

// import React, { useState } from 'react';
// import Image from 'next/image';
// import { College } from '@/types/college';
// import { useAuth } from '@/context/AuthContext';

// interface CollegePostsProps {
//   college: College;
//   isOwner: boolean;
//   isMember: boolean;
// }

// // Sample post structure - in a real app, this would be defined in types
// interface Post {
//   id: string;
//   content: string;
//   author: {
//     id: string;
//     name: string;
//     avatar?: string;
//   };
//   createdAt: number;
//   likes: number;
//   comments: number;
//   hasLiked?: boolean;
//   images?: string[];
// }

// const CollegePosts: React.FC<CollegePostsProps> = ({ college, isOwner, isMember }) => {
//   const { profile } = useAuth();
//   const [newPostContent, setNewPostContent] = useState('');
  
//   // Sample posts - in a real app, these would come from a database
//   const [posts, setPosts] = useState<Post[]>([
//     {
//       id: '1',
//       content: 'Welcome to our college page! We are excited to share updates and news with all students and faculty.',
//       author: {
//         id: college.teacherId,
//         name: college.teacherName,
//         avatar: college.logoUrl
//       },
//       createdAt: Date.now() - 86400000 * 2, // 2 days ago
//       likes: 15,
//       comments: 3,
//       hasLiked: false
//     },
//     {
//       id: '2',
//       content: 'New semester starting next month. Get ready for exciting courses and activities!',
//       author: {
//         id: college.teacherId,
//         name: college.teacherName,
//         avatar: college.logoUrl
//       },
//       createdAt: Date.now() - 86400000, // 1 day ago
//       likes: 8,
//       comments: 2,
//       hasLiked: false
//     }
//   ]);
  
//   const handleCreatePost = () => {
//     if (!newPostContent.trim()) return;
    
//     const newPost: Post = {
//       id: Date.now().toString(),
//       content: newPostContent,
//       author: {
//         id: profile?.uid || '',
//         name: profile?.displayName || 'Anonymous',
//         avatar: profile?.photoURL || college.logoUrl
//       },
//       createdAt: Date.now(),
//       likes: 0,
//       comments: 0,
//       hasLiked: false
//     };
    
//     setPosts([newPost, ...posts]);
//     setNewPostContent('');
//   };
  
//   const handleLikePost = (postId: string) => {
//     setPosts(posts.map(post => {
//       if (post.id === postId) {
//         const hasLiked = !post.hasLiked;
//         return {
//           ...post,
//           likes: hasLiked ? post.likes + 1 : post.likes - 1,
//           hasLiked
//         };
//       }
//       return post;
//     }));
//   };
  
//   const formatDate = (timestamp: number) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString();
//   };
  
//   return (
//     <div className="py-6">
//       {/* Create Post - Only visible to college owner or members */}
//       {(isOwner || isMember) && (
//         <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6">
//           <div className="flex items-start space-x-3">
//             <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
//               <Image
//                 src={profile?.photoURL || college.logoUrl}
//                 alt="Profile"
//                 width={40}
//                 height={40}
//                 className="object-cover"
//               />
//             </div>
//             <div className="flex-1">
//               <textarea
//                 value={newPostContent}
//                 onChange={(e) => setNewPostContent(e.target.value)}
//                 placeholder="Share an update..."
//                 className="w-full bg-gray-700 text-white rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <div className="flex justify-between mt-3">
//                 <div className="flex space-x-2">
//                   <button className="text-gray-400 hover:text-gray-300 p-2 rounded-full">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                   </button>
//                   <button className="text-gray-400 hover:text-gray-300 p-2 rounded-full">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
//                     </svg>
//                   </button>
//                 </div>
//                 <button
//                   onClick={handleCreatePost}
//                   disabled={!newPostContent.trim()}
//                   className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
//                     !newPostContent.trim() ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//                 >
//                   Post
//                 </button>
//               </div>
//             </div