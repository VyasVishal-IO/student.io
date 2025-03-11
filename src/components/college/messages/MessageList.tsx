// components/messages/MessageList.tsx
'use client';

import { format } from 'date-fns';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';

export default function MessageList({ messages }: { messages: any[] }) {
  const [messagesWithSenders, setMessagesWithSenders] = useState<any[]>([]);

  useEffect(() => {
    const fetchSenders = async () => {
      const messagesWithSenders = await Promise.all(
        messages.map(async (message) => {
          const senderDoc = await getDoc(doc(db, 'users', message.senderId));
          return {
            ...message,
            senderName: senderDoc.data()?.displayName || 'Unknown',
            formattedDate: format(message.createdAt?.toDate(), 'MMM dd, yyyy HH:mm')
          };
        })
      );
      setMessagesWithSenders(messagesWithSenders);
    };

    fetchSenders();
  }, [messages]);

  return (
    <div className="space-y-4 p-4">
      {messagesWithSenders.map((message) => (
        <div key={message.id} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{message.senderName}</h4>
            <span className="text-sm text-gray-500">{message.formattedDate}</span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
        </div>
      ))}
    </div>
  );
}