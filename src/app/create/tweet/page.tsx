// // // src/app/create/tweet/page.tsx
// // 'use client';
// // import { useState } from 'react';
// // import { useAuth } from '@/context/AuthContext';
// // import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// // import { db } from '@/lib/firebase';
// // import { Tweet } from '@/types/content';

// // export default function CreateTweetPage() {
// //   const { user } = useAuth();
// //   const [tweet, setTweet] = useState<Partial<Tweet>>({ content: '', tags: [] });
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!user?.uid) return;

// //     setLoading(true);
// //     try {
// //       await addDoc(collection(db, 'tweets'), {
// //         ...tweet,
// //         authorId: user.uid,
// //         createdAt: serverTimestamp(),
// //         updatedAt: serverTimestamp(),
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto p-4">
// //       <h1 className="text-2xl font-bold mb-4">Create Tweet</h1>
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <textarea
// //           value={tweet.content}
// //           onChange={(e) => setTweet({ ...tweet, content: e.target.value })}
// //           className="w-full p-2 border rounded h-32"
// //           placeholder="What's happening?"
// //           required
// //         />
// //         <input
// //           type="text"
// //           value={tweet.tags?.join(',')}
// //           onChange={(e) => setTweet({ ...tweet, tags: e.target.value.split(',') })}
// //           placeholder="Add tags (comma separated)"
// //           className="w-full p-2 border rounded"
// //         />
// //         <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
// //           {loading ? 'Posting...' : 'Tweet'}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }






// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { Tweet } from '@/types/content';
// import { toast } from 'react-hot-toast';
// import { Send, Tag, X } from 'lucide-react';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

// export default function CreateTweetPage() {
//   const { user } = useAuth();
//   const [tweet, setTweet] = useState<Partial<Tweet>>({ 
//     content: '', 
//     tags: [] 
//   });
//   const [loading, setLoading] = useState(false);
//   const [localTags, setLocalTags] = useState<string>('');

//   const handleAddTag = () => {
//     if (localTags.trim() && !tweet.tags?.includes(localTags.trim())) {
//       setTweet(prev => ({
//         ...prev, 
//         tags: [...(prev.tags || []), localTags.trim()]
//       }));
//       setLocalTags('');
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setTweet(prev => ({
//       ...prev, 
//       tags: prev.tags?.filter(tag => tag !== tagToRemove)
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user?.uid) {
//       toast.error('You must be logged in to post a tweet');
//       return;
//     }

//     // Validate tweet content
//     if (!tweet.content?.trim()) {
//       toast.error('Tweet content cannot be empty');
//       return;
//     }

//     setLoading(true);
//     try {
//       await addDoc(collection(db, 'tweets'), {
//         ...tweet,
//         authorId: user.uid,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       // Reset form and show success toast
//       setTweet({ content: '', tags: [] });
//       setLocalTags('');
//       toast.success('Tweet posted successfully!');
//     } catch (error) {
//       console.error('Error posting tweet:', error);
//       toast.error('Failed to post tweet. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Send className="w-6 h-6" />
//             Create a New Tweet
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Textarea
//               value={tweet.content}
//               onChange={(e) => setTweet({ ...tweet, content: e.target.value })}
//               placeholder="What's happening?"
//               className="resize-none"
//               maxLength={280}
//             />
//             <div className="text-sm text-muted-foreground text-right">
//               {tweet.content?.length || 0}/280
//             </div>

//             <div className="flex space-x-2">
//               <Input
//                 value={localTags}
//                 onChange={(e) => setLocalTags(e.target.value)}
//                 placeholder="Add tags"
//                 onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
//               />
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 size="icon"
//                 onClick={handleAddTag}
//               >
//                 <Tag className="w-4 h-4" />
//               </Button>
//             </div>

//             {tweet.tags && tweet.tags.length > 0 && (
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {tweet.tags.map((tag) => (
//                   <Badge 
//                     key={tag} 
//                     variant="secondary" 
//                     className="flex items-center gap-1"
//                   >
//                     {tag}
//                     <X 
//                       className="w-3 h-3 cursor-pointer" 
//                       onClick={() => handleRemoveTag(tag)} 
//                     />
//                   </Badge>
//                 ))}
//               </div>
//             )}

//             <Button 
//               type="submit" 
//               className="w-full" 
//               disabled={loading}
//             >
//               {loading ? 'Posting...' : 'Tweet'}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tweet } from '@/types/content';
import { toast } from 'react-hot-toast';
import { Send, Tag, X } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CreateTweetPage() {
  const { user } = useAuth();
  const [tweet, setTweet] = useState<Partial<Tweet>>({ 
    content: '', 
    tags: [] 
  });
  const [loading, setLoading] = useState(false);
  const [localTags, setLocalTags] = useState<string>('');

  const handleAddTag = () => {
    if (localTags.trim() && !tweet.tags?.includes(localTags.trim())) {
      setTweet(prev => ({
        ...prev, 
        tags: [...(prev.tags || []), localTags.trim()]
      }));
      setLocalTags('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTweet(prev => ({
      ...prev, 
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) {
      toast.error('You must be logged in to post a tweet');
      return;
    }

    // Validate tweet content
    if (!tweet.content?.trim()) {
      toast.error('Tweet content cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'tweets'), {
        ...tweet,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Reset form and show success toast
      setTweet({ content: '', tags: [] });
      setLocalTags('');
      toast.success('Tweet posted successfully!');
    } catch (error) {
      console.error('Error posting tweet:', error);
      toast.error('Failed to post tweet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="border-black border rounded-none shadow-none">
        <CardHeader className="border-b border-black pb-4">
          <CardTitle className="flex items-center gap-2 text-black font-normal">
            <Send className="w-5 h-5 stroke-2" />
            Compose
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              value={tweet.content}
              onChange={(e) => setTweet({ ...tweet, content: e.target.value })}
              placeholder="What's happening?"
              className="resize-none border-black focus:ring-black focus:border-black rounded-none"
              maxLength={280}
            />
            <div className="text-xs text-black text-right">
              {tweet.content?.length || 0}/280
            </div>

            <div className="flex space-x-2">
              <Input
                value={localTags}
                onChange={(e) => setLocalTags(e.target.value)}
                placeholder="Add tags"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="border-black focus:ring-black focus:border-black rounded-none"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleAddTag}
                className="border-black text-black hover:bg-gray-100 hover:text-black rounded-none"
              >
                <Tag className="w-4 h-4" />
              </Button>
            </div>

            {tweet.tags && tweet.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tweet.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="flex items-center gap-1 border-black text-black rounded-none px-2 py-1"
                  >
                    #{tag}
                    <X 
                      className="w-3 h-3 cursor-pointer ml-1" 
                      onClick={() => handleRemoveTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-900 rounded-none"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}