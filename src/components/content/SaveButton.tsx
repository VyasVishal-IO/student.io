'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

export default function SaveButton({
  contentId,
  contentType
}: {
  contentId: string;
  contentType: string;
}) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.uid && contentId) {
      const checkSaved = async () => {
        try {
          const docRef = doc(db, 'saves', `${user.uid}_${contentType}_${contentId}`);
          const docSnap = await getDoc(docRef);
          setIsSaved(docSnap.exists());
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      };
      checkSaved();
    }
  }, [user, contentId, contentType]);

  const handleSave = async () => {
    if (!user || isLoading || !contentId) return;
    setIsLoading(true);
    
    try {
      const saveRef = doc(db, 'saves', `${user.uid}_${contentType}_${contentId}`);
      
      if (isSaved) {
        await deleteDoc(saveRef);
        setIsSaved(false);
      } else {
        // Save the content
        await setDoc(saveRef, {
          userId: user.uid,
          contentId,
          contentType,
          savedAt: new Date()
        });

        // Get content details for notification
        const contentRef = doc(db, contentType, contentId);
        const contentSnap = await getDoc(contentRef);
        
        if (contentSnap.exists()) {
          const contentData = contentSnap.data();
          const creatorId = contentData.authorId || contentData.userId;
          
          // Only notify if creator is different from current user and creatorId exists
          if (creatorId && creatorId !== user.uid) {
            const contentTitle = contentData.title || 
              (contentData.description ? contentData.description.substring(0, 20) + '...' : 'Untitled');

            // Get user profile for sender name
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() : null;
            const senderName = userData?.displayName || user.displayName || 'Anonymous';

            // Create notification for content creator
            const notificationsCol = collection(db, 'notifications');
            await addDoc(notificationsCol, {
              type: 'save',
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
        
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error handling save:', error);
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
    <motion.button
      onClick={handleSave}
      disabled={isLoading || !contentId || !user}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isSaved ? 'bg-blue-50 text-blue-500' : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isSaved ? "Unsave" : "Save"}
    >
      <motion.div className="relative w-5 h-5">
        {/* Outlined bookmark (always present) */}
        <Bookmark
          size={20}
          strokeWidth={1.5}
          className={isSaved ? 'text-blue-500' : 'text-current'}
          fill="transparent"
        />
        
        {/* Filled bookmark (appears when saved) */}
        <motion.div
          className="absolute inset-0 text-blue-500"
          variants={fillVariants}
          initial="unfilled"
          animate={isSaved ? "filled" : "unfilled"}
        >
          <Bookmark
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
  );
}