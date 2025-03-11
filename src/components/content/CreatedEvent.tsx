// src/components/content/CreatedEvent.tsx
import { Event } from '@/types/content';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

export default function CreatedEvent({ event }: { event: Event }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-xl font-bold">{event.title}</h3>
      <p className="text-gray-600 mt-2">{event.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2">
          <span className="text-sm text-gray-500">
            {new Date(event.startDate).toLocaleDateString()}
          </span>
          <SaveButton contentId={event.id!} contentType="events" />
          <ShareButton contentId={event.id!} contentType="events" />
        </div>
      </div>
    </div>
  );
}