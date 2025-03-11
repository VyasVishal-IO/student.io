

// src/components/CreateCollegeForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust firebase config import path
import { useAuth } from '@/context/AuthContext';

export default function CreateCollegeForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !user) return;

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'colleges'), {
        name: name.trim(),
        description: description.trim(),
        createdBy: user.uid,
        createdAt: new Date(),
      });
      router.push(`/college/${encodeURIComponent(name.trim())}`);
      onClose();
    } catch (error) {
      console.error('Error creating college:', error);
      alert('Failed to create college. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Create New College</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            College Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-white border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create College'}
          </button>
        </div>
      </form>
    </div>
  );
}