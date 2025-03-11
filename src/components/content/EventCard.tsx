// src/components/content/EventCard.tsx
import { Event } from '@/types/content';
import Link from 'next/link';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      {event.imageUrl && (
        <img src={event.imageUrl} alt="Event" className="w-full h-48 object-cover mb-4 rounded" />
      )}
      <h3 className="text-xl font-bold">{event.title}</h3>
      <p className="text-gray-600 line-clamp-2 mt-2">{event.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <Link href={`/events/${event.id}`} className="text-blue-500 hover:underline">
          View Details
        </Link>
        <div className="flex gap-2">
          <SaveButton contentId={event.id!} contentType="events" />
          <ShareButton contentId={event.id!} contentType="events" />
        </div>
      </div>
    </div>
  );
}