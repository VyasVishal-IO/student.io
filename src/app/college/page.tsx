// src/app/collage/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust firebase config import path

interface College {
  id: string;
  name: string;
  description: string;
}

export default function CollagePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'colleges'));
        const collegesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as College[];
        setColleges(collegesData);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleCollegeClick = (name: string) => {
    router.push(`/college/${encodeURIComponent(name)}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Colleges</h1>
      <div className="space-y-4">
        {colleges.map((college) => (
          <div
            key={college.id}
            onClick={() => handleCollegeClick(college.name)}
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50"
          >
            <h2 className="text-lg font-semibold">{college.name}</h2>
            <p className="text-sm text-gray-600">{college.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}