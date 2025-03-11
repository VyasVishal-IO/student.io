// // src/app/create/post/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import ImageUploader from '@/components/common/ImageUploader';
// import { Post } from '@/types/content';

// export default function CreatePostPage() {
//   const { user } = useAuth();
//   const [post, setPost] = useState<Partial<Post>>({
//     description: '',
//     tags: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//         await addDoc(collection(db, 'posts'), {
//             ...post,
//             authorId: user?.uid,
//             createdAt: serverTimestamp(),
//             updatedAt: serverTimestamp(),
//           });
//       // Reset form or redirect
//     } catch (err) {
//       setError('Failed to create post');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Create Post</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label>Image</label>
//           <ImageUploader
//             onUpload={(url) => setPost({ ...post, imageUrl: url })}
//           />
//         </div>
        
//         <div>
//           <label>Description</label>
//           <textarea
//             value={post.description}
//             onChange={(e) => setPost({ ...post, description: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         <div>
//           <label>Tags (comma separated)</label>
//           <input
//             type="text"
//             value={post.tags?.join(',')}
//             onChange={(e) => setPost({ ...post, tags: e.target.value.split(',') })}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           {loading ? 'Creating...' : 'Create Post'}
//         </button>
        
//         {error && <p className="text-red-500">{error}</p>}
//       </form>
//     </div>
//   );
// }




// src/app/create/post/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post } from '@/types/content';
import { X, Send, Hash } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ImageUploader from '@/components/common/ImageUploader';

export default function CreatePostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Partial<Post>>({
    description: '',
    tags: [],
    imageUrl: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!post.imageUrl) {
      toast.error('Please upload an image for your post');
      return;
    }

    if (!post.description) {
      toast.error('Please add a caption for your post');
      return;
    }

    setLoading(true);
    
    try {
      await addDoc(collection(db, 'posts'), {
        ...post,
        authorId: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      toast.success('Post shared successfully!');
      
      // Redirect to explore page after a brief delay to show the toast
      setTimeout(() => {
        router.push('/explore');
      }, 1000);
      
    } catch (err) {
      toast.error('Failed to create post. Please try again.');
      setLoading(false);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;
    
    if (post.tags?.includes(trimmedTag)) {
      toast.error('Tag already added');
      return;
    }
    
    if (post.tags && post.tags.length >= 30) {
      toast.error('Maximum 30 tags allowed');
      return;
    }
    
    setPost({
      ...post,
      tags: [...(post.tags || []), trimmedTag]
    });
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setPost({
      ...post,
      tags: post.tags?.filter(t => t !== tagToRemove)
    });
  };

  const removeImage = () => {
    setPost({
      ...post,
      imageUrl: '',
    });
  };

  const charactersRemaining = 500 - (post.description?.length || 0);
  const tagsRemaining = 30 - (post.tags?.length || 0);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <Toaster position="top-center" />
      
      <div className="sticky top-0 z-10 bg-white py-4 px-4 border-b">
        <h1 className="text-xl font-bold text-center">Create Post</h1>
      </div>
      
      <div className="p-4 flex flex-col space-y-4">
        {/* Image Upload Section */}
        <div className="w-full">
          <ImageUploader 
            onUpload={(url) => setPost({ ...post, imageUrl: url })}
            currentImage={post.imageUrl}
            onRemove={removeImage}
          />
        </div>
        
        {/* Caption Section */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <label htmlFor="caption">Caption</label>
            <span>{charactersRemaining}/500</span>
          </div>
          <Textarea
            id="caption"
            placeholder="Write a caption..."
            value={post.description || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 500) {
                setPost({ ...post, description: value });
              }
            }}
            rows={4}
            className="resize-none w-full"
          />
        </div>
        
        {/* Tags Section */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <label htmlFor="tags">Tags</label>
            <span>{tagsRemaining}/30</span>
          </div>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={addTag} 
              variant="outline" 
              size="icon"
              aria-label="Add tag"
            >
              <Hash className="h-4 w-4" />
            </Button>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs pl-2 pr-1 py-1 flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Share Button - Fixed to bottom */}
      <div className="sticky bottom-0 p-4 bg-white border-t">
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          {loading ? "Sharing..." : "Share Post"}
        </Button>
      </div>
    </div>
  );
}