
// src/components/content/LikeButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function LikeButton({
  contentId,
  contentType
}: {
  contentId: string;
  contentType: string;
}) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Check if content is already liked and get likes count
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user?.uid) return;
      
      try {
        // Check if user liked the content
        const likeRef = doc(db, 'likes', `${user.uid}_${contentType}_${contentId}`);
        const likeSnap = await getDoc(likeRef);
        setIsLiked(likeSnap.exists());
        
        // In a real app, you would have a counter or query to get the likes count
        // This is just a simplified placeholder
        setLikesCount(Math.floor(Math.random() * 100));
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    
    checkLikeStatus();
  }, [user, contentId, contentType]);

  // Handle like/unlike action
  const handleLike = async () => {
    if (!user || isLoading) return;
    setIsLoading(true);

    try {
      const likeRef = doc(db, 'likes', `${user.uid}_${contentType}_${contentId}`);

      if (isLiked) {
        // Unlike the content
        await deleteDoc(likeRef);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Like the content
        await setDoc(likeRef, {
          userId: user.uid,
          contentId,
          contentType,
          likedAt: new Date()
        });
        setLikesCount(prev => prev + 1);

        // Fetch content details for notifications
        const contentRef = doc(db, contentType, contentId);
        const contentSnap = await getDoc(contentRef);

        if (contentSnap.exists()) {
          const contentData = contentSnap.data();
          const creatorId = contentData.authorId;
          
          // Only notify if creator is different from user
          if (creatorId !== user.uid) {
            const contentTitle = contentData.title || contentData.description?.substring(0, 20) || 'Untitled';

            // Fetch user profile for sender name
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            const senderName = userSnap.data()?.displayName || 'Anonymous';

            // Create notification
            const notificationsCol = collection(db, 'notifications');
            await addDoc(notificationsCol, {
              type: 'like',
              recipientUserId: creatorId,
              senderUserId: user.uid,
              senderName,
              contentId,
              contentType,
              contentTitle,
              read: false,
              createdAt: new Date()
            });
          }
        }
      }

      // Toggle like state
      setIsLiked(prev => !prev);
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fillVariants = {
    filled: {
      opacity: 1,
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    },
    unfilled: {
      opacity: 0,
      scale: 0
    }
  };

  return (
    <div className="flex items-center">
      <motion.button
        onClick={handleLike}
        disabled={isLoading}
        className={`relative flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isLiked ? 'bg-red-50 text-red-500' : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <motion.div className="relative w-5 h-5">
          {/* Outlined heart (always present) */}
          <Heart
            size={20}
            strokeWidth={1.5}
            className={isLiked ? 'text-red-500' : 'text-current'}
            fill="transparent"
          />
          
          {/* Filled heart (appears when liked) */}
          <motion.div
            className="absolute inset-0 text-red-500"
            variants={fillVariants}
            initial="unfilled"
            animate={isLiked ? "filled" : "unfilled"}
          >
            <Heart
              size={20}
              strokeWidth={1.5}
              fill="currentColor"
              stroke="none"
            />
          </motion.div>
        </motion.div>
        
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-5 h-5 border border-t-transparent border-gray-300 rounded-full animate-spin"></div>
          </motion.div>
        )}
      </motion.button>
      
      {likesCount > 0 && (
        <span className="text-sm font-medium ml-1 text-gray-700 dark:text-gray-300">
          {likesCount}
        </span>
      )}
    </div>
  );
}
