// // // src/components/content/PostCard.tsx
// // import { Post } from '@/types/content';
// // import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { Button } from "@/components/ui/button";
// // import { Heart, Bookmark, Share2, Link as LinkIcon } from "lucide-react";
// // import Link from 'next/link';
// // import { useState } from 'react';
// // import SaveButton from './SaveButton';
// // import ShareButton from './ShareButton';
// // import LinkButton from './LinkButton';
// // import LikeButton from './LikeButton';

// // export default function PostCard({ post }: { post: Post }) {
// //   const [isImageLoaded, setIsImageLoaded] = useState(false);

// //   return (
// //     <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
// //       <Link href={`/post/${post.id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
// //         {post.imageUrl && (
// //           <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gray-100">
// //             <img 
// //               src={post.imageUrl} 
// //               alt={post.title || "Post image"} 
// //               className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
// //               onLoad={() => setIsImageLoaded(true)}
// //             />
// //             {!isImageLoaded && (
// //               <div className="absolute inset-0 flex items-center justify-center">
// //                 <span className="animate-pulse bg-gray-200 w-full h-full"></span>
// //               </div>
// //             )}
// //           </div>
// //         )}
        
// //         <CardHeader className="pb-2">
// //           {post.author && (
// //             <div className="flex items-center space-x-2 mb-2">
// //               <Avatar className="h-6 w-6">
// //                 <AvatarImage src={post.author.avatar || ""} alt={post.author.name || "Author"} />
// //                 <AvatarFallback>{post.author.name?.substring(0, 2) || "AU"}</AvatarFallback>
// //               </Avatar>
// //               <span className="text-sm font-medium text-gray-700">{post.author.name}</span>
// //               {post.publishedAt && (
// //                 <span className="text-xs text-gray-500">
// //                   {new Date(post.publishedAt).toLocaleDateString()}
// //                 </span>
// //               )}
// //             </div>
// //           )}
// //           {post.title && <h3 className="font-semibold text-lg md:text-xl line-clamp-2">{post.title}</h3>}
// //         </CardHeader>
        
// //         <CardContent>
// //           <p className="text-gray-700 text-sm md:text-base line-clamp-3">{post.description}</p>
// //         </CardContent>
// //       </Link>
      
// //       <CardFooter className="flex flex-col space-y-3 pt-2 pb-3">
// //         {post.tags && post.tags.length > 0 && (
// //           <div className="flex flex-wrap gap-1.5 w-full">
// //             {post.tags.slice(0, 3).map((tag) => (
// //               <Badge key={tag} variant="outline" className="text-xs bg-slate-50 hover:bg-slate-100">
// //                 #{tag}
// //               </Badge>
// //             ))}
// //             {post.tags.length > 3 && (
// //               <Badge variant="outline" className="text-xs bg-slate-50">
// //                 +{post.tags.length - 3}
// //               </Badge>
// //             )}
// //           </div>
// //         )}
        
// //         <div className="flex justify-between items-center w-full">
// //           <div className="flex items-center space-x-1">
// //             <LikeButton contentId={post.id!} contentType="posts" />
// //             {post.likes && (
// //               <span className="text-xs text-gray-500">{post.likes}</span>
// //             )}
// //           </div>
          
// //           <div className="flex items-center space-x-1">
// //             <SaveButton contentId={post.id!} contentType="posts" />
// //             <ShareButton contentId={post.id!} contentType="posts" />
// //             <LinkButton contentId={post.id!} contentType="posts" />
// //           </div>
// //         </div>
// //       </CardFooter>
// //     </Card>
// //   );
// // }






// // src/components/content/PostCard.tsx
// import { useState, useEffect } from 'react';
// import { Post } from '@/types/content';
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { 
//   CalendarIcon, 
//   Clock, 
//   MessageCircle, 
//   ExternalLink, 
//   Bookmark,
//   Share2,
//   ThumbsUp,
//   MoreHorizontal 
// } from "lucide-react";
// import Link from 'next/link';
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { db } from '@/lib/firebase';
// import { doc, getDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
// import { formatDistanceToNow } from 'date-fns';
// import { useAuth } from '@/context/AuthContext'; // Assuming you have an auth context

// // Post types for different platforms
// type BasePost = {
//   id?: string;
//   title?: string;
//   description?: string;
//   imageUrl?: string;
//   tags?: string[];
//   likes?: number;
//   authorId: string;
//   createdAt: { seconds: number; nanoseconds: number };
//   updatedAt: { seconds: number; nanoseconds: number };
// }

// interface LinkedInPost extends BasePost {
//   source: 'linkedin';
//   companyName?: string;
//   jobTitle?: string;
//   commentCount?: number;
//   shareCount?: number;
// }

// interface InstagramPost extends BasePost {
//   source: 'instagram';
//   location?: string;
//   commentCount?: number;
//   saveCount?: number;
//   filter?: string;
// }

// type SocialPost = LinkedInPost | InstagramPost;

// // Author type
// interface Author {
//   id: string;
//   name: string;
//   avatar?: string;
//   username?: string;
//   jobTitle?: string;
//   company?: string;
//   verified?: boolean;
//   followers?: number;
// }

// interface PostCardProps {
//   post: SocialPost;
//   variant?: 'default' | 'compact' | 'featured';
//   showActions?: boolean;
//   showAuthor?: boolean;
//   onAction?: (action: string, postId: string) => void;
// }

// export default function PostCard({
//   post,
//   variant = 'default',
//   showActions = true,
//   showAuthor = true,
//   onAction
// }: PostCardProps) {
//   const [isImageLoaded, setIsImageLoaded] = useState(false);
//   const [author, setAuthor] = useState<Author | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const { user } = useAuth();

//   // Fetch author data based on authorId
//   useEffect(() => {
//     const fetchAuthor = async () => {
//       try {
//         if (post.authorId) {
//           const authorRef = doc(db, 'users', post.authorId);
//           const authorDoc = await getDoc(authorRef);
          
//           if (authorDoc.exists()) {
//             setAuthor({
//               id: authorDoc.id,
//               name: authorDoc.data().displayName || 'Anonymous',
//               avatar: authorDoc.data().photoURL,
//               username: authorDoc.data().username,
//               jobTitle: authorDoc.data().jobTitle,
//               company: authorDoc.data().company,
//               verified: authorDoc.data().verified || false,
//               followers: authorDoc.data().followers || 0
//             });
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching author:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const checkUserInteractions = async () => {
//       if (!user || !post.id) return;
      
//       try {
//         const userRef = doc(db, 'users', user.uid);
//         const userDoc = await getDoc(userRef);
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           setIsLiked(userData.likedPosts?.includes(post.id) || false);
//           setIsSaved(userData.savedPosts?.includes(post.id) || false);
//         }
//       } catch (error) {
//         console.error('Error checking user interactions:', error);
//       }
//     };

//     fetchAuthor();
//     checkUserInteractions();
//   }, [post.authorId, post.id, user]);

//   // Convert Firestore timestamp to Date
//   const createdAtDate = post.createdAt ? new Date(post.createdAt.seconds * 1000) : new Date();
  
//   // Format relative time (e.g., "2 hours ago")
//   const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });

//   // Handle interactions
//   const handleLike = async () => {
//     if (!user || !post.id) return;
    
//     try {
//       const postRef = doc(db, 'posts', post.id);
//       const userRef = doc(db, 'users', user.uid);
      
//       if (isLiked) {
//         await updateDoc(postRef, {
//           likes: increment(-1)
//         });
//         await updateDoc(userRef, {
//           likedPosts: arrayRemove(post.id)
//         });
//       } else {
//         await updateDoc(postRef, {
//           likes: increment(1)
//         });
//         await updateDoc(userRef, {
//           likedPosts: arrayUnion(post.id)
//         });
//       }
      
//       setIsLiked(!isLiked);
//       if (onAction) onAction('like', post.id);
//     } catch (error) {
//       console.error('Error updating like status:', error);
//     }
//   };

//   const handleSave = async () => {
//     if (!user || !post.id) return;
    
//     try {
//       const userRef = doc(db, 'users', user.uid);
      
//       if (isSaved) {
//         await updateDoc(userRef, {
//           savedPosts: arrayRemove(post.id)
//         });
//       } else {
//         await updateDoc(userRef, {
//           savedPosts: arrayUnion(post.id)
//         });
//       }
      
//       setIsSaved(!isSaved);
//       if (onAction) onAction('save', post.id);
//     } catch (error) {
//       console.error('Error updating save status:', error);
//     }
//   };

//   const handleShare = () => {
//     if (post.id && onAction) {
//       onAction('share', post.id);
//     }
//   };

//   // Helper function to render platform-specific UI
//   const renderPlatformSpecificContent = () => {
//     if (post.source === 'linkedin') {
//       return (
//         <div className="flex items-center mt-1 text-xs text-gray-500">
//           {author?.jobTitle && (
//             <span className="mr-1">{author.jobTitle}</span>
//           )}
//           {author?.company && (
//             <>
//               <span className="mx-1">•</span>
//               <span>{author.company}</span>
//             </>
//           )}
//         </div>
//       );
//     } else if (post.source === 'instagram') {
//       return (
//         (post as InstagramPost).location && (
//           <div className="text-xs text-gray-500 mt-1">
//             📍 {(post as InstagramPost).location}
//           </div>
//         )
//       );
//     }
//     return null;
//   };

//   // Render appropriate card size based on variant
//   const cardClasses = {
//     default: "w-full overflow-hidden",
//     compact: "w-full max-w-sm overflow-hidden",
//     featured: "w-full overflow-hidden md:flex md:flex-row"
//   };

//   const imageClasses = {
//     default: "relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-100",
//     compact: "relative w-full h-40 overflow-hidden bg-gray-100",
//     featured: "relative w-full md:w-2/5 h-48 sm:h-56 md:h-auto overflow-hidden bg-gray-100"
//   };

//   const contentClasses = {
//     default: "",
//     compact: "",
//     featured: "md:w-3/5 flex flex-col"
//   };

//   return (
//     <Card className={`${cardClasses[variant]} transition-all duration-300 hover:shadow-lg border border-gray-200`}>
//       <div className={variant === 'featured' ? 'md:flex' : ''}>
//         {post.imageUrl && (
//           <Link href={`/post/${post.id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
//             <div className={imageClasses[variant]}>
//               <img 
//                 src={post.imageUrl} 
//                 alt={post.title || "Post image"} 
//                 className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
//                 onLoad={() => setIsImageLoaded(true)}
//               />
//               {!isImageLoaded && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="animate-pulse bg-gray-200 w-full h-full"></span>
//                 </div>
//               )}
              
//               {post.source === 'instagram' && (
//                 <div className="absolute top-2 right-2">
//                   <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
//                     Instagram
//                   </Badge>
//                 </div>
//               )}
              
//               {post.source === 'linkedin' && (
//                 <div className="absolute top-2 right-2">
//                   <Badge className="bg-blue-600 text-white border-none">
//                     LinkedIn
//                   </Badge>
//                 </div>
//               )}
//             </div>
//           </Link>
//         )}
        
//         <div className={contentClasses[variant]}>
//           <CardHeader className="pb-2">
//             {showAuthor && (
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center space-x-2">
//                   {loading ? (
//                     <div className="flex items-center space-x-2">
//                       <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
//                       <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
//                     </div>
//                   ) : (
//                     <div className="flex items-center">
//                       <Link href={`/profile/${author?.id}`} className="group">
//                         <div className="flex items-center space-x-2">
//                           <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-transparent group-hover:ring-primary transition-all">
//                             <AvatarImage src={author?.avatar || ""} alt={author?.name || "Author"} />
//                             <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
//                               {author?.name?.substring(0, 2) || "AU"}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <div className="flex items-center">
//                               <span className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">
//                                 {author?.name || 'Anonymous'}
//                               </span>
//                               {author?.verified && (
//                                 <TooltipProvider>
//                                   <Tooltip>
//                                     <TooltipTrigger asChild>
//                                       <svg className="h-4 w-4 ml-1 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
//                                         <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                       </svg>
//                                     </TooltipTrigger>
//                                     <TooltipContent>
//                                       <p>Verified Account</p>
//                                     </TooltipContent>
//                                   </Tooltip>
//                                 </TooltipProvider>
//                               )}
//                             </div>
//                             {renderPlatformSpecificContent()}
//                           </div>
//                         </div>
//                       </Link>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <div className="flex items-center text-xs text-gray-500">
//                     <Clock className="h-3 w-3 mr-1" />
//                     <span>{timeAgo}</span>
//                   </div>
                  
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)}>
//                         Copy link
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => window.open(`${window.location.origin}/post/${post.id}`, '_blank')}>
//                         Open in new tab
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => onAction && onAction('report', post.id!)}>
//                         Report post
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             )}
            
//             <Link href={`/post/${post.id}`} className="block focus:outline-none hover:text-primary transition-colors">
//               {post.title ? (
//                 <h3 className="font-semibold text-lg md:text-xl line-clamp-2">{post.title}</h3>
//               ) : (
//                 <h3 className="font-semibold text-lg md:text-xl line-clamp-2">Untitled Post</h3>
//               )}
//             </Link>
//           </CardHeader>
          
//           <CardContent>
//             <Link href={`/post/${post.id}`} className="block focus:outline-none">
//               <p className="text-gray-700 text-sm md:text-base line-clamp-3">
//                 {post.description || "No description available"}
//               </p>
//             </Link>
//           </CardContent>
          
//           {(post.tags && post.tags.length > 0 || showActions) && (
//             <CardFooter className="flex flex-col space-y-3 pt-2 pb-3">
//               {post.tags && post.tags.length > 0 && (
//                 <div className="flex flex-wrap gap-1.5 w-full">
//                   {post.tags.slice(0, 3).map((tag, index) => (
//                     <Link href={`/tag/${tag.replace(/^#/, '')}`} key={index}>
//                       <Badge variant="outline" className="text-xs bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
//                         {tag.startsWith('#') ? tag : `#${tag}`}
//                       </Badge>
//                     </Link>
//                   ))}
//                   {post.tags.length > 3 && (
//                     <Badge variant="outline" className="text-xs bg-slate-50">
//                       +{post.tags.length - 3}
//                     </Badge>
//                   )}
//                 </div>
//               )}
              
//               {showActions && (
//                 <div className="flex justify-between items-center w-full">
//                   <div className="flex items-center space-x-4">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className={`flex items-center space-x-1 ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}
//                       onClick={handleLike}
//                     >
//                       <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
//                       <span className="text-xs">{post.likes || 0}</span>
//                     </Button>
                    
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="flex items-center space-x-1 text-gray-600"
//                       onClick={() => onAction && onAction('comment', post.id!)}
//                     >
//                       <MessageCircle className="h-4 w-4" />
//                       <span className="text-xs">
//                         {post.source === 'linkedin' 
//                           ? (post as LinkedInPost).commentCount || 0 
//                           : (post as InstagramPost).commentCount || 0
//                         }
//                       </span>
//                     </Button>
//                   </div>
                  
//                   <div className="flex items-center space-x-1">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className={`h-8 w-8 p-0 ${isSaved ? 'text-amber-500' : 'text-gray-600'}`}
//                       onClick={handleSave}
//                     >
//                       <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
//                     </Button>
                    
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-8 w-8 p-0 text-gray-600"
//                       onClick={handleShare}
//                     >
//                       <Share2 className="h-4 w-4" />
//                     </Button>
                    
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-8 w-8 p-0 text-gray-600"
//                       onClick={() => window.open(`${window.location.origin}/post/${post.id}`, '_blank')}
//                     >
//                       <ExternalLink className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </CardFooter>
//           )}
//         </div>
//       </div>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

// UI Components
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Icons
import {
  CalendarIcon,
  Clock,
  MessageCircle,
  ExternalLink,
  Bookmark,
  Share2,
  ThumbsUp,
  MoreHorizontal,
  Flag,
  Copy,
  CheckCircle
} from "lucide-react";

// Firebase
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

// Types
import { Post, Author } from '@/types/content';

// Social platform icons
const PlatformBadge = ({ platform }: { platform: string }) => {
  const badgeConfig = {
    linkedin: {
      bgClass: "bg-blue-600",
      icon: (
        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      )
    },
    instagram: {
      bgClass: "bg-gradient-to-r from-purple-500 to-pink-500",
      icon: (
        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
      )
    },
    twitter: {
      bgClass: "bg-sky-500",
      icon: (
        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
        </svg>
      )
    },
    default: {
      bgClass: "bg-gray-600",
      icon: null
    }
  };

  const config = badgeConfig[platform as keyof typeof badgeConfig] || badgeConfig.default;

  return (
    <Badge className={`${config.bgClass} text-white border-none flex items-center text-xs px-2 py-1`}>
      {config.icon}
      <span className="capitalize">{platform}</span>
    </Badge>
  );
};

// Social post types
interface BasePost {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  likes?: number;
  authorId: string;
  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  source: string;
  commentCount?: number;
}

// Props interface
interface PostCardProps {
  post: BasePost;
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  showAuthor?: boolean;
  onAction?: (action: string, postId: string) => void;
  className?: string;
}

export default function PostCard({
  post,
  variant = 'default',
  showActions = true,
  showAuthor = true,
  onAction,
  className = ""
}: PostCardProps) {
  // State
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  
  const { user } = useAuth();

  // Fetch author data and user interactions
  useEffect(() => {
    const fetchAuthor = async () => {
      if (!post.authorId) {
        setLoading(false);
        return;
      }
      
      try {
        const authorRef = doc(db, 'users', post.authorId);
        const authorSnap = await getDoc(authorRef);
        
        if (authorSnap.exists()) {
          const data = authorSnap.data();
          setAuthor({
            id: authorSnap.id,
            name: data.displayName || 'Anonymous',
            avatar: data.photoURL,
            username: data.username,
            jobTitle: data.jobTitle,
            company: data.company,
            verified: data.verified || false
          });
        }
      } catch (error) {
        console.error('Error fetching author:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkUserInteractions = async () => {
      if (!user?.uid || !post.id) return;
      
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsLiked(userData.likedPosts?.includes(post.id) || false);
          setIsSaved(userData.savedPosts?.includes(post.id) || false);
        }
      } catch (error) {
        console.error('Error checking user interactions:', error);
      }
    };

    fetchAuthor();
    if (user) checkUserInteractions();
  }, [post.authorId, post.id, user]);

  // Derived values
  const createdAtDate = post.createdAt ? new Date(post.createdAt.seconds * 1000) : new Date();
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  
  // Post URL for sharing
  const postUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/post/${post.id}`;
    }
    return `/post/${post.id}`;
  }, [post.id]);

  // Interaction handlers
  const handleLike = async () => {
    if (!user?.uid || !post.id) {
      // Show login prompt if needed
      onAction?.('login_required', post.id);
      return;
    }
    
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      const postRef = doc(db, 'posts', post.id);
      const userRef = doc(db, 'users', user.uid);
      
      if (isLiked) {
        await updateDoc(postRef, { likes: increment(-1) });
        await updateDoc(userRef, { likedPosts: arrayRemove(post.id) });
      } else {
        await updateDoc(postRef, { likes: increment(1) });
        await updateDoc(userRef, { likedPosts: arrayUnion(post.id) });
      }
      
      onAction?.('like', post.id);
    } catch (error) {
      // Revert UI on error
      console.error('Error updating like status:', error);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleSave = async () => {
    if (!user?.uid || !post.id) {
      onAction?.('login_required', post.id);
      return;
    }
    
    // Optimistic UI update
    setIsSaved(!isSaved);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      
      if (isSaved) {
        await updateDoc(userRef, { savedPosts: arrayRemove(post.id) });
      } else {
        await updateDoc(userRef, { savedPosts: arrayUnion(post.id) });
      }
      
      onAction?.('save', post.id);
    } catch (error) {
      // Revert UI on error
      console.error('Error updating save status:', error);
      setIsSaved(!isSaved);
    }
  };

  const handleShare = async () => {
    if (!post.id) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title || 'Shared post',
          text: post.description || 'Check out this post',
          url: postUrl
        });
        onAction?.('share', post.id);
      } catch (error) {
        console.error('Error sharing post:', error);
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (!post.id) return;
    
    navigator.clipboard.writeText(postUrl).then(() => {
      setShowCopiedTooltip(true);
      setTimeout(() => setShowCopiedTooltip(false), 2000);
      onAction?.('copy_link', post.id);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  };

  const handleOpenInNewTab = () => {
    if (!post.id) return;
    window.open(postUrl, '_blank');
    onAction?.('open_new_tab', post.id);
  };

  const handleReportPost = () => {
    if (!post.id) return;
    onAction?.('report', post.id);
  };

  // Styling based on variant
  const cardClasses = {
    default: "w-full overflow-hidden transition-all duration-300 hover:shadow-md",
    compact: "w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-md",
    featured: "w-full overflow-hidden transition-all duration-300 hover:shadow-md"
  };

  const imageClasses = {
    default: "relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-100",
    compact: "relative w-full h-40 overflow-hidden bg-gray-100",
    featured: "relative w-full md:w-2/5 h-48 sm:h-auto md:h-64 overflow-hidden bg-gray-100"
  };

  const contentClasses = {
    default: "",
    compact: "",
    featured: "md:w-3/5 flex flex-col"
  };

  // Author metadata display based on platform
  const renderAuthorMetadata = () => {
    if (!author) return null;
    
    switch (post.source) {
      case 'linkedin':
        return (
          <div className="flex items-center mt-1 text-xs text-gray-500">
            {author.jobTitle && <span>{author.jobTitle}</span>}
            {author.jobTitle && author.company && <span className="mx-1">•</span>}
            {author.company && <span>{author.company}</span>}
          </div>
        );
      case 'instagram':
        return post.location && (
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
            <span>{post.location}</span>
          </div>
        );
      case 'twitter':
        return author.username && (
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span>@{author.username}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`${cardClasses[variant]} ${className} border border-gray-200`}>
      <div className={variant === 'featured' ? 'md:flex' : ''}>
        {/* Image Section */}
        {post.imageUrl && (
          <Link href={`/post/${post.id}`} className="block focus:outline-none focus:ring-0 focus:ring-offset-0">
            <div className={imageClasses[variant]}>
              {/* Platform Badge */}
              <div className="absolute top-2 right-2 z-10">
                <PlatformBadge platform={post.source} />
              </div>
              
              {/* Image with loading state */}
              <img 
                src={post.imageUrl} 
                alt={post.title || "Post content"} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
                loading="lazy"
              />
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                </div>
              )}
            </div>
          </Link>
        )}
        
        {/* Content Section */}
        <div className={contentClasses[variant]}>
          <CardHeader className="pb-2">
            {/* Author Section */}
            {showAuthor && (
              <div className="flex items-center justify-between mb-2">
                {/* Author info with loading state */}
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16 mt-1" />
                    </div>
                  </div>
                ) : (
                  <Link href={`/profile/${author?.id || '#'}`} className="group flex items-center space-x-2">
                    <Avatar className="h-8 w-8 ring-1 ring-offset-1 ring-gray-200 group-hover:ring-primary transition-all">
                      <AvatarImage 
                        src={author?.avatar || ""} 
                        alt={author?.name || "Author"} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                        {author?.name?.substring(0, 2) || "AU"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">
                          {author?.name || 'Anonymous'}
                        </span>
                        {author?.verified && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CheckCircle className="h-3.5 w-3.5 ml-1 text-blue-500 fill-white" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs">Verified Account</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {renderAuthorMetadata()}
                    </div>
                  </Link>
                )}
                
                {/* Post metadata and actions */}
                <div className="flex items-center space-x-1">
                  {/* Timestamp */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-xs text-gray-500 px-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{timeAgo}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">{createdAtDate.toLocaleString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Post actions dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center" 
                        onClick={handleCopyLink}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {showCopiedTooltip ? 'Copied!' : 'Copy link'}
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center" 
                        onClick={handleOpenInNewTab}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in new tab
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center text-red-600 hover:text-red-700" 
                        onClick={handleReportPost}
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Report post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            
            {/* Post Title */}
            <Link 
              href={`/post/${post.id}`} 
              className="block focus:outline-none group"
            >
              <h3 className="font-semibold text-lg md:text-xl line-clamp-2 group-hover:text-primary transition-colors">
                {post.title || "Untitled Post"}
              </h3>
            </Link>
          </CardHeader>
          
          {/* Post Description */}
          <CardContent>
            <Link 
              href={`/post/${post.id}`} 
              className="block focus:outline-none"
            >
              <p className="text-gray-700 text-sm line-clamp-3">
                {post.description || "No description available"}
              </p>
            </Link>
          </CardContent>
          
          {/* Tags and Actions */}
          {((post.tags && post.tags.length > 0) || showActions) && (
            <CardFooter className="flex flex-col space-y-3 pt-2 pb-3">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 w-full">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <Link 
                      href={`/tag/${tag.replace(/^#/, '')}`} 
                      key={index}
                    >
                      <Badge 
                        variant="outline" 
                        className="text-xs font-normal bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </Badge>
                    </Link>
                  ))}
                  {post.tags.length > 3 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="text-xs bg-slate-50">
                            +{post.tags.length - 3}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="text-xs max-w-xs">
                            {post.tags.slice(3).map((tag, i) => (
                              <span key={i} className="mr-1">
                                {tag.startsWith('#') ? tag : `#${tag}`}
                              </span>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
              
              {/* Interaction Buttons */}
              {showActions && (
                <div className="flex justify-between items-center w-full mt-1">
                  {/* Left side actions (like, comment) */}
                  <div className="flex items-center space-x-4">
                    {/* Like button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center space-x-1.5 px-2 h-8 rounded-full hover:bg-gray-100 
                        ${isLiked ? 'text-blue-600 hover:text-blue-700' : 'text-gray-600 hover:text-gray-700'}`}
                      onClick={handleLike}
                    >
                      <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="text-xs font-medium">{likeCount}</span>
                    </Button>
                    
                    {/* Comment button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1.5 px-2 h-8 rounded-full text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                      onClick={() => onAction?.('comment', post.id || '')}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">{post.commentCount || 0}</span>
                    </Button>
                  </div>
                  
                  {/* Right side actions (save, share, open) */}
                  <div className="flex items-center space-x-1">
                    {/* Save button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 w-8 p-0 rounded-full ${
                              isSaved ? 'text-amber-500 hover:text-amber-600' : 'text-gray-600 hover:text-gray-700'
                            } hover:bg-gray-100`}
                            onClick={handleSave}
                          >
                            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">{isSaved ? 'Unsave' : 'Save'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {/* Share button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                            onClick={handleShare}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Share</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {/* Open in new tab button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                            onClick={handleOpenInNewTab}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Open</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              )}
            </CardFooter>
          )}
        </div>
      </div>
    </Card>
  );
}