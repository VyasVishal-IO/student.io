// Example: src/components/content/ArticleDetail.tsx
import { Article } from '@/types/content';

export default function ArticleDetail({ article }: { article: Article }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      <div className="mt-6">
        {article.links?.map((link, index) => (
          <a key={index} href={link} target="_blank" className="text-blue-500 block mt-2">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}