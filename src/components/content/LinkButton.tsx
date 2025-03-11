// src/components/content/LinkButton.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'lucide-react';

export default function LinkButton({ 
  contentId,
  contentType
}: {
  contentId: string;
  contentType: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}/${contentType}/${contentId}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <motion.button
      onClick={handleCopyLink}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-gray-100 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-label={isCopied ? "Link copied" : "Copy link"}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isCopied ? [1, 1.2, 1] : 1,
          y: isCopied ? [0, -3, 0] : 0,
          transition: { duration: 0.3 }
        }}
      >
        {isCopied ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-green-500 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </motion.div>
        ) : (
          <Link size={20} strokeWidth={1.5} />
        )}
      </motion.div>
    </motion.button>
  );
}
