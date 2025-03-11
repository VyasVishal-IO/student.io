// src/components/content/TweetDetail.tsx
import { Tweet } from '@/types/content';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';
import LinkButton from './LinkButton';

export default function TweetDetail({ tweet }: { tweet: Tweet }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-4">Tweet</h1>
      <div className="flex gap-4 mb-6">
        <SaveButton contentId={tweet.id!} contentType="tweets" />
        <ShareButton contentId={tweet.id!} contentType="tweets" />
        <LinkButton contentId={tweet.id!} contentType="tweets" />
      </div>

      <div className="prose max-w-none mb-6">
        <p className="whitespace-pre-wrap">{tweet.content}</p>
      </div>

      <div className="flex gap-2">
        {tweet.tags?.map((tag) => (
          <span key={tag} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}