
// src/components/content/ShareButton.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Copy, Twitter, Facebook, Linkedin, MessageCircle } from 'lucide-react';

export default function ShareButton({ 
  contentId, 
  contentType 
}: { 
  contentId: string;
  contentType: string;
}) {
  const [shareUrl, setShareUrl] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShareUrl(`${window.location.origin}/${contentType}/${contentId}`);
    
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contentId, contentType]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleSharePlatform = (platform: string) => {
    let shareLink = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent('Check this out!');
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={toggleMenu}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-gray-100 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        aria-label="Share"
        aria-expanded={isMenuOpen}
      >
        <Share2 size={20} strokeWidth={1.5} />
      </motion.button>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="absolute bottom-full mb-2 right-0 sm:right-auto sm:left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 w-48 z-10 border border-gray-200 dark:border-gray-700"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium">Share</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
              
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Copy size={16} className={isCopied ? "text-green-500" : ""} />
                <span className="text-sm">{isCopied ? "Copied!" : "Copy link"}</span>
              </button>
              
              <button
                onClick={() => handleSharePlatform('twitter')}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Twitter size={16} className="text-blue-400" />
                <span className="text-sm">Twitter</span>
              </button>
              
              <button
                onClick={() => handleSharePlatform('facebook')}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Facebook size={16} className="text-blue-600" />
                <span className="text-sm">Facebook</span>
              </button>
              
              <button
                onClick={() => handleSharePlatform('linkedin')}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Linkedin size={16} className="text-blue-700" />
                <span className="text-sm">LinkedIn</span>
              </button>
              
              <button
                onClick={() => handleSharePlatform('whatsapp')}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MessageCircle size={16} className="text-green-500" />
                <span className="text-sm">WhatsApp</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
