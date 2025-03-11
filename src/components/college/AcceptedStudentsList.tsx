// components/collage/AcceptedStudentsList.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, getDoc } from 'firebase/firestore';

export default function AcceptedStudentsList({ collegeId }: { collegeId: string }) {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'acceptedStudents'),
      where('collegeId', '==', collegeId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentsData = snapshot.docs.map(async doc => {
        const studentDoc = await getDoc(doc.data().studentId);
        return {
          id: doc.id,
          ...doc.data(),
          studentData: studentDoc.data()
        };
      });
      Promise.all(studentsData).then(setStudents);
    });

    return unsubscribe;
  }, [collegeId]);

  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="p-4 text-xl font-semibold border-b">Accepted Students</h2>
      <div className="p-4">
        {students.map(student => (
          <div key={student.id} className="py-2 border-b">
            <p className="font-medium">{student.studentData?.displayName}</p>
            <p className="text-sm text-gray-500">{student.studentData?.email}</p>
          </div>
        ))}
        {students.length === 0 && (
          <p className="text-gray-500">No accepted students yet</p>
        )}
      </div>
    </div>
  );
}