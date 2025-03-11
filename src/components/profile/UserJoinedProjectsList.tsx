// New component: src/components/profile/UserJoinedProjectsList.tsx
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';

export default function UserJoinedProjectsList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'projects'),
      where('members', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Your Joined Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">You haven't joined any projects yet.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="border p-4 rounded hover:bg-gray-50"
            >
              <h3 className="font-medium">{project.title}</h3>
              <p className="text-gray-600 text-sm">{project.category}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}