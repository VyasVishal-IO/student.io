
// src/components/content/SocialActionBar.tsx
'use client';

import { memo } from 'react';
import LinkButton from './LinkButton';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

interface SocialActionBarProps {
  contentId: string;
  contentType: string;
  className?: string;
}

const SocialActionBar = memo(function SocialActionBar({
  contentId,
  contentType,
  className = ''
}: SocialActionBarProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <LikeButton contentId={contentId} contentType={contentType} />
      <SaveButton contentId={contentId} contentType={contentType} />
      <ShareButton contentId={contentId} contentType={contentType} />
      <LinkButton contentId={contentId} contentType={contentType} />
    </div>
  );
});

export default SocialActionBar;