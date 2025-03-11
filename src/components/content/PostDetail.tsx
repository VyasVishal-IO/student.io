// src/components/content/PostDetail.tsx
import { Post } from '@/types/content';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';
import LinkButton from './LinkButton';

 function PostDetail({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-4">Post Details</h1>
      <div className="flex gap-4 mb-6">
        <SaveButton contentId={post.id!} contentType="posts" />
        <ShareButton contentId={post.id!} contentType="posts" />
        <LinkButton contentId={post.id!} contentType="posts" />
      </div>

      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt="Post" 
          className="w-full h-96 object-cover mb-6 rounded-lg"
        />
      )}

      <div className="prose max-w-none">
        <p>{post.description}</p>
      </div>

      <div className="mt-6 flex gap-2">
        {post.tags?.map((tag) => (
          <span key={tag} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PostDetail;