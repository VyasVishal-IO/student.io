// components/college/SendCollegeMessage.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export default function SendCollegeMessage({ collegeId, teacherId }: { collegeId: string, teacherId: string }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const checkTeacherStatus = async () => {
      const collegeDoc = await getDoc(doc(db, 'colleges', collegeId));
      setIsTeacher(collegeDoc.data()?.teachers?.includes(user?.uid));
    };
    checkTeacherStatus();
  }, [collegeId, user?.uid]);


  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'messages'), {
        collegeId,
        senderId: teacherId,
        content: message.trim(),
        createdAt: serverTimestamp()
      });
      setMessage('');
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (!isTeacher) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-lg font-medium">Send Message to Students</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
        rows={4}
        placeholder="Write your message to students..."
      />
      <button
        onClick={handleSend}
        disabled={isSending}
        className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
      >
        {isSending ? 'Sending...' : 'Send Message'}
      </button>
    </div>
  );
}