// src/components/content/CreatedPost.tsx
import { Post } from '@/types/content';

export default function CreatedPost({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-48 object-cover mb-4 rounded"
        />
      )}
      <p className="text-gray-800">{post.description}</p>
      <div className="mt-2 flex gap-2">
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}