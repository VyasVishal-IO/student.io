// src/components/content/ContributionForm.tsx
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import ImageUploader from '@/components/common/ImageUploader';

interface ContributionFormProps {
  projectId: string;
}

export default function ContributionForm({ projectId }: ContributionFormProps) {
  const { user, profile } = useAuth();
  const [text, setText] = useState('');
  const [links, setLinks] = useState<Array<{ title: string; url: string }>>([]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      setLinks(prev => [...prev, newLink]);
      setNewLink({ title: '', url: '' });
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'projects', projectId, 'contributions'), {
        text,
        links,
        files,
        userId: user.uid,
        userName: profile.displayName,
        userEmail: profile.email,
        userAvatar: profile.avatar,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Reset form
      setText('');
      setLinks([]);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-bold mb-4">Add Contribution</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your contribution..."
          className="w-full p-2 border rounded"
          rows={4}
          required
        />

        <ImageUploader 
          onUpload={(urls) => setFiles(prev => [...prev, ...urls])} 
        //   multiple
        />

        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              placeholder="Link Title"
              value={newLink.title}
              onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
              className="flex-1 p-2 border rounded"
            />
            <input
              placeholder="URL"
              type="url"
              value={newLink.url}
              onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="bg-gray-200 px-4 rounded hover:bg-gray-300"
            >
              Add Link
            </button>
          </div>
          
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 bg-white p-2 rounded">
              <a href={link.url} target="_blank" className="text-blue-500 flex-1">
                {link.title}
              </a>
              <button
                type="button"
                onClick={() => handleRemoveLink(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Add Contribution'}
        </button>
      </form>
    </div>
  );
}