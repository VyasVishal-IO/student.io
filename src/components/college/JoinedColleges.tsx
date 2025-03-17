// src/components/college/JoinedColleges.tsx
import { useState } from 'react';
import Link from 'next/link';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface JoinedCollegesProps {
  joinedColleges: any[];
  user: any;
}

export default function JoinedColleges({ joinedColleges, user }: JoinedCollegesProps) {
  const [message, setMessage] = useState('');
  const [activeCollegeId, setActiveCollegeId] = useState<string | null>(null);
  
  const sendMessageToStudents = async (collegeId: string) => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        collegeId,
        senderId: user?.uid,
        content: message.trim(),
        createdAt: serverTimestamp(),
        senderName: user?.displayName
      });
      setMessage('');
      setActiveCollegeId(null);
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  return (
    <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Joined Colleges</h3>
        <div className="mt-4">
          {joinedColleges.length === 0 ? (
            <p className="text-gray-500">You haven't joined any colleges yet.</p>
          ) : (
            <div className="space-y-4">
              {joinedColleges.map((college) => (
                <div
                  key={college.id}
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <Link
                    href={`/college/${encodeURIComponent(college.name)}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800"
                  >
                    {college.name}
                  </Link>
                  <p className="mt-1 text-sm text-gray-600">{college.description}</p>
                  
                  <div className="mt-2 flex space-x-4">
                    <button
                      onClick={() => setActiveCollegeId(activeCollegeId === college.id ? null : college.id)}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      {activeCollegeId === college.id ? 'Cancel Message' : 'Send Message to Students'}
                    </button>
                    <Link
                      href={`/college/${encodeURIComponent(college.name)}/assignments`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Manage Assignments
                    </Link>
                  </div>
                  
                  {activeCollegeId === college.id && (
                    <div className="mt-4">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder="Write a message for students..."
                      />
                      <button
                        onClick={() => sendMessageToStudents(college.id)}
                        className="mt-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Send Message
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}