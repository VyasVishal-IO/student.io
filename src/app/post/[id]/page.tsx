"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit, increment, updateDoc, arrayUnion, arrayRemove, addDoc, serverTimestamp } from 'firebase/firestore';
import { formatDistanceToNow, format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Icons
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThumbsUp,
  User,
} from "lucide-react";

// Firebase
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

// Components
import PostCard from '@/components/content/PostCard';
// import CommentItem from '@/components/CommentItem'; // You'll need to create this component

// Platform Badge component (from your PostCard)
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

// Types
interface Author {
  id: string;
  name: string;
  avatar?: string;
  username?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  verified?: boolean;
  followers?: number;
  following?: boolean;
}

interface Post {
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string[];
  likes?: number;
  views?: number;
  authorId: string;
  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  source: string;
  location?: string;
  commentCount?: number;
  shareCount?: number;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: Author;
  createdAt: { seconds: number; nanoseconds: number };
  likes?: number;
  replies?: Comment[];
}

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  // State
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeTab, setActiveTab] = useState('comments');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const postRef = doc(db, 'posts', id as string);
        const postSnap = await getDoc(postRef);
        
        if (postSnap.exists()) {
          const postData = { ...postSnap.data(), id: postSnap.id } as Post;
          setPost(postData);
          setLikeCount(postData.likes || 0);
          
          // Increment view count
          await updateDoc(postRef, {
            views: increment(1)
          });
          
          // Fetch author details
          if (postData.authorId) {
            const authorRef = doc(db, 'users', postData.authorId);
            const authorSnap = await getDoc(authorRef);
            
            if (authorSnap.exists()) {
              const authorData = authorSnap.data();
              setAuthor({
                id: authorSnap.id,
                name: authorData.displayName || 'Anonymous',
                avatar: authorData.photoURL,
                username: authorData.username,
                jobTitle: authorData.jobTitle,
                company: authorData.company,
                bio: authorData.bio,
                verified: authorData.verified || false,
                followers: authorData.followers || 0
              });
            }
          }
        } else {
          // Post not found
          router.push('/404');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  // Check user interactions
  useEffect(() => {
    const checkUserInteractions = async () => {
      if (!user?.uid || !id) return;
      
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsLiked(userData.likedPosts?.includes(id) || false);
          setIsSaved(userData.savedPosts?.includes(id) || false);
          
          // Check if following author
          if (author?.id) {
            setAuthor(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                following: userData.following?.includes(author.id) || false
              };
            });
          }
        }
      } catch (error) {
        console.error('Error checking user interactions:', error);
      }
    };

    if (user && post) {
      checkUserInteractions();
    }
  }, [user, id, post, author?.id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      
      setCommentLoading(true);
      try {
        const commentsRef = collection(db, 'comments');
        const q = query(
          commentsRef, 
          where('postId', '==', id),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const commentsData: Comment[] = [];
        
        // Process all comments
        for (const doc of querySnapshot.docs) {
          const comment = { ...doc.data(), id: doc.id } as Comment;
          
          // Fetch comment author
          if (comment.authorId) {
            const authorRef = doc(db, 'users', comment.authorId);
            const authorSnap = await getDoc(authorRef);
            
            if (authorSnap.exists()) {
              const authorData = authorSnap.data();
              comment.author = {
                id: authorSnap.id,
                name: authorData.displayName || 'Anonymous',
                avatar: authorData.photoURL,
                username: authorData.username,
                verified: authorData.verified || false
              };
            }
          }
          
          commentsData.push(comment);
        }
        
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setCommentLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  // Fetch related posts
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!post || !post.tags || post.tags.length === 0) return;
      
      setRelatedLoading(true);
      try {
        const postsRef = collection(db, 'posts');
        
        // Try to find posts with similar tags
        const q = query(
          postsRef,
          where('tags', 'array-contains-any', post.tags.slice(0, 3)),
          where('id', '!=', id),
          limit(4)
        );
        
        const querySnapshot = await getDocs(q);
        const postsData: Post[] = [];
        
        querySnapshot.forEach((doc) => {
          postsData.push({ ...doc.data(), id: doc.id } as Post);
        });
        
        // If not enough related posts, fetch latest posts
        if (postsData.length < 3) {
          const latestQ = query(
            postsRef,
            where('id', '!=', id),
            orderBy('createdAt', 'desc'),
            limit(4 - postsData.length)
          );
          
          const latestSnapshot = await getDocs(latestQ);
          latestSnapshot.forEach((doc) => {
            // Avoid duplicates
            if (!postsData.some(p => p.id === doc.id)) {
              postsData.push({ ...doc.data(), id: doc.id } as Post);
            }
          });
        }
        
        setRelatedPosts(postsData);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setRelatedLoading(false);
      }
    };

    if (post) {
      fetchRelatedPosts();
    }
  }, [post, id]);

  // Interaction handlers
  const handleLike = async () => {
    if (!user?.uid || !id) {
      // Show login prompt
      router.push(`/login?redirect=/post/${id}`);
      return;
    }
    
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      const postRef = doc(db, 'posts', id as string);
      const userRef = doc(db, 'users', user.uid);
      
      if (isLiked) {
        await updateDoc(postRef, { likes: increment(-1) });
        await updateDoc(userRef, { likedPosts: arrayRemove(id) });
      } else {
        await updateDoc(postRef, { likes: increment(1) });
        await updateDoc(userRef, { likedPosts: arrayUnion(id) });
      }
      
    } catch (error) {
      // Revert UI on error
      console.error('Error updating like status:', error);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleSave = async () => {
    if (!user?.uid || !id) {
      router.push(`/login?redirect=/post/${id}`);
      return;
    }
    
    // Optimistic UI update
    setIsSaved(!isSaved);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      
      if (isSaved) {
        await updateDoc(userRef, { savedPosts: arrayRemove(id) });
      } else {
        await updateDoc(userRef, { savedPosts: arrayUnion(id) });
      }
      
    } catch (error) {
      // Revert UI on error
      console.error('Error updating save status:', error);
      setIsSaved(!isSaved);
    }
  };

  const handleShare = async () => {
    if (!id) return;
    
    // Get post URL
    const postUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/post/${id}`
      : `/post/${id}`;
      
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || 'Shared post',
          text: post?.description || 'Check out this post',
          url: postUrl
        });
        
        // Update share count
        if (post?.id) {
          const postRef = doc(db, 'posts', post.id);
          await updateDoc(postRef, { 
            shareCount: increment(1) 
          });
        }
      } catch (error) {
        console.error('Error sharing post:', error);
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (!id) return;
    
    // Get post URL
    const postUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/post/${id}`
      : `/post/${id}`;
    
    navigator.clipboard.writeText(postUrl).then(() => {
      setShowCopiedTooltip(true);
      setTimeout(() => setShowCopiedTooltip(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  };

  const handleFollowAuthor = async () => {
    if (!user?.uid || !author?.id) {
      router.push(`/login?redirect=/post/${id}`);
      return;
    }
    
    // Optimistic UI update
    const isFollowing = author.following || false;
    setAuthor(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        following: !isFollowing,
        followers: prev.followers ? (isFollowing ? prev.followers - 1 : prev.followers + 1) : 1
      };
    });
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const authorRef = doc(db, 'users', author.id);
      
      if (isFollowing) {
        await updateDoc(userRef, { following: arrayRemove(author.id) });
        await updateDoc(authorRef, { followers: increment(-1) });
      } else {
        await updateDoc(userRef, { following: arrayUnion(author.id) });
        await updateDoc(authorRef, { followers: increment(1) });
      }
      
    } catch (error) {
      // Revert UI on error
      console.error('Error updating follow status:', error);
      setAuthor(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          following: isFollowing,
          followers: prev.followers ? (isFollowing ? prev.followers : prev.followers - 1) : 0
        };
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!user?.uid || !id || !commentText.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      // Add new comment
      const commentData = {
        content: commentText.trim(),
        authorId: user.uid,
        postId: id,
        createdAt: serverTimestamp(),
        likes: 0
      };
      
      const commentRef = await addDoc(collection(db, 'comments'), commentData);
      
      // Update post comment count
      const postRef = doc(db, 'posts', id as string);
      await updateDoc(postRef, { 
        commentCount: increment(1) 
      });
      
      // Update UI
      const newComment: Comment = {
        id: commentRef.id,
        ...commentData,
        author: {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || undefined,
          verified: false
        },
        createdAt: {
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: 0
        }
      };
      
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      
      // Set active tab to comments
      setActiveTab('comments');
      
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReportPost = async () => {
    if (!user?.uid || !id || !reportReason.trim()) return;
    
    try {
      await addDoc(collection(db, 'reports'), {
        postId: id,
        reporterId: user.uid,
        reason: reportReason,
        createdAt: serverTimestamp()
      });
      
      // Close dialog and reset
      setReportReason('');
      setIsReportDialogOpen(false);
      
      // Show confirmation (you can add a toast notification here)
      
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  // Helper functions
  const formatDate = (date: Date) => {
    return format(date, 'MMMM d, yyyy');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col space-y-6">
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
          </div>
          
          {/* Image */}
          <Skeleton className="w-full h-80 rounded-lg" />
          
          {/* Content */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center mb-4">Post not found</h2>
        <p className="text-gray-600 text-center mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/')}>
          Return to Home
        </Button>
      </div>
    );
  }

  // Derived values
  const createdAtDate = post.createdAt ? new Date(post.createdAt.seconds * 1000) : new Date();
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });

  return (
    <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      {/* Back button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      {/* Post Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <PlatformBadge platform={post.source} />
          
          <span className="text-gray-500 text-sm flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {timeAgo}
          </span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title || "Untitled Post"}
        </h1>
        
        {/* Author section */}
        <div className="flex items-center justify-between">
          {/* Author info */}
          <Link 
            href={`/profile/${author?.id || '#'}`}
            className="group flex items-center space-x-3"
          >
            <Avatar className="h-10 w-10 ring-1 ring-offset-1 ring-gray-200 group-hover:ring-primary transition-all">
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
                <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                  {author?.name || 'Anonymous'}
                </span>
                {author?.verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CheckCircle className="h-4 w-4 ml-1 text-blue-500 fill-white" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Verified Creator</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              <div className="flex items-center text-xs text-gray-500">
                {author?.jobTitle && <span>{author.jobTitle}</span>}
                {author?.jobTitle && author?.company && <span className="mx-1">•</span>}
                {author?.company && <span>{author.company}</span>}
              </div>
            </div>
          </Link>

          {/* Follow button */}
          {author && author.id !== user?.uid && (
            <Button
              size="sm"
              variant={author.following ? "outline" : "default"}
              onClick={handleFollowAuthor}
              className={author.following ? 
                "text-primary hover:text-primary-600 border-primary hover:border-primary-600" : 
                "bg-primary hover:bg-primary-600"}
            >
              {author.following ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Post Content */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden mb-8">
        {/* Featured Image */}
        {post.imageUrl && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-100">
            <img 
              src={post.imageUrl} 
              alt={post.title || "Post image"} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              </div>
            )}
          </div>
        )}
        
        {/* Post Body */}
        <CardContent className="pt-6 pb-4">
          {/* Description */}
          <p className="text-gray-700 text-base sm:text-lg mb-6">
            {post.description || "No description available"}
          </p>
          
          {/* Full content */}
          <div className="prose prose-sm sm:prose max-w-none">
            {post.content || post.description || "No content available"}
          </div>
          
         {/* Tags */}
         {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 cursor-pointer"
                  onClick={() => router.push(`/tags/${tag}`)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        
        {/* Post Footer with Interactions */}
        <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 mr-1.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            
            {/* Comment Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-gray-600 hover:text-primary"
              onClick={() => setActiveTab('comments')}
            >
              <MessageCircle className="h-5 w-5 mr-1.5" />
              <span>{post.commentCount || comments.length || 0}</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Save Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-9 w-9 ${isSaved ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                    onClick={handleSave}
                  >
                    <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">{isSaved ? 'Saved' : 'Save'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Share Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-gray-600 hover:text-primary"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-gray-600 hover:text-primary"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyLink} className="flex items-center">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center"
                  onClick={() => window.open(`https://${post.source}.com`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on {post.source}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center text-red-600 focus:text-red-600"
                  onClick={() => setIsReportDialogOpen(true)}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Copy Tooltip */}
            {showCopiedTooltip && (
              <div className="absolute right-16 bottom-4 bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                Copied to clipboard!
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* Comments and Related Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="comments" className="text-sm">
            Comments ({post.commentCount || comments.length || 0})
          </TabsTrigger>
          <TabsTrigger value="related" className="text-sm">
            Related Posts
          </TabsTrigger>
        </TabsList>
        
        {/* Comments Section */}
        <TabsContent value="comments" className="space-y-6">
          {/* Comment input */}
          {user ? (
            <div className="flex space-x-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || "You"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.displayName?.substring(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea 
                  placeholder="Share your thoughts..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="resize-none min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || isSubmittingComment}
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Card className="bg-gray-50 p-4 text-center">
              <p className="text-gray-600 mb-3">Sign in to join the conversation</p>
              <Button onClick={() => router.push(`/login?redirect=/post/${id}`)}>
                Sign In
              </Button>
            </Card>
          )}
          
          {/* Comments list */}
          {commentLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  postId={id as string}
                  currentUser={user}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No comments yet</h3>
              <p className="text-gray-500">Be the first to share your thoughts</p>
            </div>
          )}
        </TabsContent>
        
        {/* Related Posts Section */}
        <TabsContent value="related">
          {relatedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map(relatedPost => (
                <PostCard key={relatedPost.id} post={relatedPost} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ExternalLink className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No related posts found</h3>
              <p className="text-gray-500">Check back later for more content</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Report Dialog */}
      <AlertDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report this post</AlertDialogTitle>
            <AlertDialogDescription>
              Please let us know why you're reporting this post. Your report will be reviewed by our team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Describe the issue..." 
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="resize-none min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReportPost}
              disabled={!reportReason.trim()}
            >
              Submit Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Author Bio (Mobile) */}
      <div className="md:hidden mt-8 lg:mt-0">
        {author?.bio && (
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <User className="h-5 w-5 mr-2 text-gray-500" />
              <h3 className="font-medium">About {author.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{author.bio}</p>
          </Card>
        )}
      </div>
    </main>
  );
}