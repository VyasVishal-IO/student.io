// src/components/content/TweetCard.tsx
import { Tweet } from '@/types/content';
import Link from 'next/link';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

export default function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <p className="text-gray-800 whitespace-pre-wrap line-clamp-3">{tweet.content}</p>
      <div className="mt-4 flex justify-between items-center">
        <Link 
          href={`/tweets/${tweet.id}`}
          className="text-blue-500 hover:underline"
        >
          View Tweet
        </Link>
        <div className="flex gap-2">
          <SaveButton contentId={tweet.id!} contentType="tweets" />
          <ShareButton contentId={tweet.id!} contentType="tweets" />
        </div>
      </div>
    </div>
  );
}