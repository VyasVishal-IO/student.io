// 'use client';
// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { Article } from '@/types/content';
// import dynamic from 'next/dynamic';

// const RichTextEditor = dynamic(() => import('@/components/common/RichTextEditor'), { ssr: false });

// export default function CreateArticlePage() {
//   const { user } = useAuth();
//   const [article, setArticle] = useState<Partial<Article>>({
//     title: '',
//     content: '',
//     links: [],
//     tags: [],
//   });
//   const [newLink, setNewLink] = useState({ title: '', url: '' });
//   const [newTag, setNewTag] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user?.uid) return;

//     setLoading(true);
//     try {
//       await addDoc(collection(db, 'articles'), {
//         ...article,
//         authorId: user.uid,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });
//       setArticle({ title: '', content: '', links: [], tags: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddLink = () => {
//     if (newLink.title && newLink.url) {
//       setArticle((prev) => ({ ...prev, links: [...(prev.links || []), newLink] }));
//       setNewLink({ title: '', url: '' });
//     }
//   };

//   const handleAddTag = () => {
//     if (newTag) {
//       setArticle((prev) => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
//       setNewTag('');
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Create Article</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           value={article.title}
//           onChange={(e) => setArticle({ ...article, title: e.target.value })}
//           className="w-full p-2 border rounded"
//           placeholder="Article Title"
//           required
//         />
//         <RichTextEditor
//           value={article.content}
//           onChange={(content) => setArticle({ ...article, content })}
//         />
//         <div className="space-y-2">
//           <h2 className="font-semibold">Article Links</h2>
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               value={newLink.title}
//               onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
//               placeholder="Link Title"
//               className="w-1/2 p-2 border rounded"
//             />
//             <input
//               type="url"
//               value={newLink.url}
//               onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
//               placeholder="Link URL"
//               className="w-1/2 p-2 border rounded"
//             />
//             <button type="button" onClick={handleAddLink} className="bg-green-500 text-white px-4 py-2 rounded">
//               Add
//             </button>
//           </div>
//           <ul>
//             {article.links?.map((link, index) => (
//               <li key={index} className="text-sm">
//                 {link.title}: <a href={link.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">{link.url}</a>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="space-y-2">
//           <h2 className="font-semibold">Tags</h2>
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               value={newTag}
//               onChange={(e) => setNewTag(e.target.value)}
//               placeholder="Add Tag"
//               className="w-full p-2 border rounded"
//             />
//             <button type="button" onClick={handleAddTag} className="bg-green-500 text-white px-4 py-2 rounded">
//               Add
//             </button>
//           </div>
//           <ul className="flex flex-wrap gap-2">
//             {article.tags?.map((tag, index) => (
//               <li key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">{tag}</li>
//             ))}
//           </ul>
//         </div>
//         <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
//           {loading ? 'Publishing...' : 'Publish Article'}
//         </button>
//       </form>
//     </div>
//   );
// }



'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Article } from '@/types/content';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/common/RichTextEditor'), { ssr: false });

export default function CreateArticlePage() {
  const { user } = useAuth();
  const [article, setArticle] = useState<Partial<Article>>({
    title: '',
    content: '',
    links: [],
    tags: [],
  });
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'articles'), {
        ...article,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setArticle({ title: '', content: '', links: [], tags: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      setArticle((prev) => ({ ...prev, links: [...(prev.links || []), newLink] }));
      setNewLink({ title: '', url: '' });
    }
  };

  const handleAddTag = () => {
    if (newTag) {
      setArticle((prev) => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
      setNewTag('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setArticle((prev) => ({
      ...prev,
      links: prev.links?.filter((_, i) => i !== index) || []
    }));
  };

  const handleRemoveTag = (index: number) => {
    setArticle((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-light mb-8 tracking-tight">New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label htmlFor="title" className="text-xs uppercase tracking-wider text-gray-600">Title</label>
          <input
            id="title"
            type="text"
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            className="w-full p-3 border-b border-black focus:outline-none focus:border-b-2 bg-transparent text-xl font-light"
            placeholder="Enter article title"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-gray-600">Content</label>
          <div className="border border-gray-200 focus-within:border-black transition-colors duration-200">
            <RichTextEditor
              value={article.content}
              onChange={(content) => setArticle({ ...article, content })}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-gray-600">Links</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                placeholder="Link title"
                className="w-1/3 p-2 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent"
              />
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="URL"
                className="w-1/2 p-2 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent"
              />
              <button 
                type="button" 
                onClick={handleAddLink} 
                className="border border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition-colors duration-200"
              >
                Add
              </button>
            </div>
            
            {article.links && article.links.length > 0 && (
              <ul className="space-y-2 mt-2">
                {article.links.map((link, index) => (
                  <li key={index} className="flex items-center justify-between border-b border-gray-100 py-2">
                    <div className="text-sm">
                      <span className="font-medium">{link.title}</span>: 
                      <a href={link.url} className="ml-2 text-gray-600 hover:text-black" target="_blank" rel="noopener noreferrer">
                        {link.url}
                      </a>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveLink(index)} 
                      className="text-xs text-gray-400 hover:text-black transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-gray-600">Tags</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                className="w-full p-2 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent"
              />
              <button 
                type="button" 
                onClick={handleAddTag} 
                className="border border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition-colors duration-200"
              >
                Add
              </button>
            </div>
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {article.tags.map((tag, index) => (
                  <div key={index} className="flex items-center border border-gray-300 px-3 py-1 text-sm group">
                    <span>{tag}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(index)} 
                      className="ml-2 text-gray-400 group-hover:text-black transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-8">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full md:w-auto px-8 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}