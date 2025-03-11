'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function StudentList({ collageId }: { collageId: string }) {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, 'collages', collageId, 'students'));
      setStudents(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchStudents();
  }, [collageId]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Collage Students</h2>
      {students.length === 0 ? (
        <p>No students yet.</p>
      ) : (
        <ul className="space-y-2">
          {students.map(student => (
            <li key={student.studentId} className="p-4 bg-gray-100 rounded-lg">
              {student.studentName} ({student.studentEmail})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}