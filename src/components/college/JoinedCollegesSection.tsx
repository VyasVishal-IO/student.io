'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { School, Loader } from 'lucide-react';
import Link from 'next/link';

type College = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

type JoinedCollegesSectionProps = {
  userId: string;
};

export default function JoinedCollegesSection({ userId }: JoinedCollegesSectionProps) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedColleges = async () => {
      try {
        // Query colleges where the user is in the students array
        const collegesQuery = query(
          collection(db, 'colleges'),
          where('students', 'array-contains', userId)
        );

        const collegesSnapshot = await getDocs(collegesQuery);
        const collegesData = collegesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'Unknown',
        })) as College[];

        setColleges(collegesData);
      } catch (error) {
        console.error('Error fetching joined colleges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedColleges();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (colleges.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>You haven't joined any colleges yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <School className="h-6 w-6" />
        Joined Colleges
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleges.map((college) => (
          <Link
            key={college.id}
            href={`/college/${encodeURIComponent(college.name)}`}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium">{college.name}</h3>
            <p className="text-sm text-gray-600 mt-2">{college.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              Joined on: {college.createdAt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

