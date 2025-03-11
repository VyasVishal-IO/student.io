// 'use client';
// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { Event } from '@/types/content';

// export default function CreateEventPage() {
//   const { user } = useAuth();
//   const [event, setEvent] = useState<Partial<Event>>({
//     title: '',
//     description: '',
//     startDate: '',
//     endDate: '',
//     links: [],
//   });
//   const [newLink, setNewLink] = useState({ title: '', url: '' });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user?.uid) return;

//     setLoading(true);
//     try {
//       await addDoc(collection(db, 'events'), {
//         ...event,
//         authorId: user.uid,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });
//       setEvent({ title: '', description: '', startDate: '', endDate: '', links: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddLink = () => {
//     if (newLink.title && newLink.url) {
//       setEvent((prev) => ({ ...prev, links: [...(prev.links || []), newLink] }));
//       setNewLink({ title: '', url: '' });
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Create Event</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           value={event.title}
//           onChange={(e) => setEvent({ ...event, title: e.target.value })}
//           className="w-full p-2 border rounded"
//           placeholder="Event Title"
//           required
//         />
//         <textarea
//           value={event.description}
//           onChange={(e) => setEvent({ ...event, description: e.target.value })}
//           className="w-full p-2 border rounded h-24"
//           placeholder="Event Description"
//           required
//         />
//         <input
//           type="date"
//           value={event.startDate}
//           onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="date"
//           value={event.endDate}
//           onChange={(e) => setEvent({ ...event, endDate: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <div className="space-y-2">
//           <h2 className="font-semibold">Event Links</h2>
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               value={newLink.title}
//               onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
//               placeholder="Link Title"
//               className="w-1/2 p-2 border rounded"
//             />
//             <input
//               type="url"
//               value={newLink.url}
//               onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
//               placeholder="Link URL"
//               className="w-1/2 p-2 border rounded"
//             />
//             <button type="button" onClick={handleAddLink} className="bg-green-500 text-white px-4 py-2 rounded">
//               Add
//             </button>
//           </div>
//           <ul>
//             {event.links?.map((link, index) => (
//               <li key={index} className="text-sm">
//                 {link.title}: <a href={link.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">{link.url}</a>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
//           {loading ? 'Creating...' : 'Create Event'}
//         </button>
//       </form>
//     </div>
//   );
// }






'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Link as LinkIcon, 
  MapPin, 
  DollarSign, 
  Users, 
  Tag 
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Zod validation schema
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid end date"),
  location: z.string().optional(),
  eventType: z.enum(["Online", "In-Person", "Hybrid"]),
  category: z.string().optional(),
  maxParticipants: z.number().optional(),
  registrationFee: z.number().optional(),
  isPublic: z.boolean().default(true),
  links: z.array(z.object({
    title: z.string().min(1, "Link title is required"),
    url: z.string().url("Invalid URL")
  })).optional()
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const { user } = useAuth();
  const [links, setLinks] = useState<{title: string, url: string}[]>([]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const { 
    control, 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      eventType: 'In-Person',
      isPublic: true
    }
  });

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      setValue('links', updatedLinks);
      setNewLink({ title: '', url: '' });
    }
  };

  const removeLink = (indexToRemove: number) => {
    const updatedLinks = links.filter((_, index) => index !== indexToRemove);
    setLinks(updatedLinks);
    setValue('links', updatedLinks);
  };

  const onSubmit = async (data: EventFormData) => {
    if (!user?.uid) {
      toast.error('You must be logged in to create an event');
      return;
    }

    try {
      await addDoc(collection(db, 'events'), {
        ...data,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Event created successfully!');
      reset();
      setLinks([]);
    } catch (error) {
      toast.error('Failed to create event');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Create New Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Event Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Event Title</Label>
                <Input 
                  {...register('title')}
                  placeholder="Enter event title" 
                  icon={<Tag className="w-4 h-4" />}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div>
                <Label>Event Type</Label>
                <Controller
                  name="eventType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="In-Person">In-Person</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea 
                {...register('description')}
                placeholder="Describe your event" 
                className="h-24"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Date and Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input 
                  type="date" 
                  {...register('startDate')}
                />
                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
              </div>

              <div>
                <Label>End Date</Label>
                <Input 
                  type="date" 
                  {...register('endDate')}
                />
                {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
              </div>
            </div>

            <div>
              <Label>Location</Label>
              <Input 
                {...register('location')}
                placeholder="Event location" 
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>

            {/* Additional Details */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Max Participants</Label>
                <Input 
                  type="number" 
                  {...register('maxParticipants', { 
                    setValueAs: v => v === '' ? undefined : parseInt(v) 
                  })}
                  placeholder="Optional"
                  icon={<Users className="w-4 h-4" />}
                />
              </div>

              <div>
                <Label>Registration Fee</Label>
                <Input 
                  type="number" 
                  {...register('registrationFee', { 
                    setValueAs: v => v === '' ? undefined : parseFloat(v) 
                  })}
                  placeholder="Optional"
                  icon={<DollarSign className="w-4 h-4" />}
                />
              </div>

              <div className="flex items-center space-x-2 mt-6">
                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label>Public Event</Label>
              </div>
            </div>

            {/* Event Links */}
            <div>
              <Label>Event Links</Label>
              <div className="flex space-x-2 mb-2">
                <Input 
                  value={newLink.title}
                  onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Link Title"
                  icon={<LinkIcon className="w-4 h-4" />}
                />
                <Input 
                  value={newLink.url}
                  onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="URL"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddLink}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>

              {links.map((link, index) => (
                <div key={index} className="flex items-center space-x-2 mb-1">
                  <span className="flex-grow">{link.title}: {link.url}</span>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}