// src/components/content/CreatedTweet.tsx
import { Tweet } from '@/types/content';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

export default function CreatedTweet({ tweet }: { tweet: Tweet }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <p className="text-gray-800 whitespace-pre-wrap">{tweet.content}</p>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2">
          {tweet.tags?.map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <SaveButton contentId={tweet.id!} contentType="tweets" />
          <ShareButton contentId={tweet.id!} contentType="tweets" />
        </div>
      </div>
    </div>
  );
}