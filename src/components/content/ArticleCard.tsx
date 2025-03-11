// src/components/content/ArticleCard.tsx
import { Article } from '@/types/content';
import Link from 'next/link';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-xl font-bold">{article.title}</h3>
      <p className="text-gray-600 mt-2 line-clamp-3">{article.content}</p>
      <div className="mt-4 flex justify-between items-center">
        <Link 
          href={`/articles/${article.id}`}
          className="text-blue-500 hover:underline"
        >
          Read More
        </Link>
        <div className="flex gap-2">
          <SaveButton contentId={article.id!} contentType="articles" />
          <ShareButton contentId={article.id!} contentType="articles" />
        </div>
      </div>
    </div>
  );
}