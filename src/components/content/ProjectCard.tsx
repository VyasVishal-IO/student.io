// "use client"

// // src/components/content/ProjectCard.tsx (updated)
// import { Project } from '@/types/content';
// import Link from 'next/link';
// import SaveButton from './SaveButton';

// import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// // import JoinButton from './JoinButton';

// export default function ProjectCard({ project }: { project: Project }) {
//   return (
//     <div className="bg-white rounded-lg shadow p-4 mb-4 hover:shadow-lg transition-shadow">
//       <h3 className="text-xl font-bold">{project.title}</h3>
//       <div className="flex items-center gap-2 mt-2">
//         <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
//           {project.category}
//         </span>
//         <span className="text-sm text-gray-500">
//           {project.currentMembers?.length || 0}/{project.teamSize} members
//         </span>
//       </div>
//       <p className="text-gray-600 line-clamp-2 mt-2">{project.description}</p>
      
//       <div className="mt-4 flex items-center justify-between">
//         <Link 
//           href={`/projects/${project.id}`}
//           className="text-blue-500 hover:underline"
//         >
//           View Project
//         </Link>
//         <div className="flex gap-2">
//           <SaveButton contentId={project.id || ""} contentType="projects" />
//         </div>
//       </div>
//     </div>
//   );
// }




"use client"

import { Project } from '@/types/content';
import Link from 'next/link';
import SaveButton from './SaveButton';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, Clock, Tag, ChevronRight, Award, Share2 } from 'lucide-react';

export default function ProjectCard({ project }: { project: Project }) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate progress percentage
  const memberPercentage = project.currentMembers?.length 
    ? Math.min(Math.round((project.currentMembers.length / project.teamSize) * 100), 100)
    : 0;
  
  // Determine if the project is new (less than 7 days old)
  const isNew = project.createdAt 
    ? (new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 3600 * 24) < 7
    : false;
    
  // Check if project team is almost full
  const isAlmostFull = project.currentMembers?.length && project.teamSize 
    ? project.currentMembers.length >= project.teamSize * 0.8 
    : false;

  // Format date if available
  const formattedDate = project.createdAt 
    ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Recently added';
    
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      {/* Mobile-friendly card layout */}
      <div className="relative w-full">
        {/* Background / Image */}
        <div className={`w-full ${project.imageUrl ? 'h-48 sm:h-40' : 'h-24 sm:h-20'} relative overflow-hidden`}>
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-500 to-violet-600"></div>
          )}
          
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Save button - fixed position for consistency */}
          <div className="absolute top-3 right-3 z-10">
            <SaveButton 
              contentId={project.id || ""} 
              contentType="projects" 
              variant="circle"
            />
          </div>
          
          {/* Category and status badges */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 z-10">
            <span className="text-xs font-medium bg-white/90 text-blue-700 px-3 py-1 rounded-full">
              {project.category}
            </span>
            {isNew && (
              <span className="text-xs font-medium bg-green-500 text-white px-3 py-1 rounded-full animate-pulse">
                NEW
              </span>
            )}
            {isAlmostFull && (
              <span className="text-xs font-medium bg-amber-500 text-white px-3 py-1 rounded-full">
                Almost Full
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Content section */}
      <div className="p-4">
        {/* Project title */}
        <h3 className="text-lg font-bold text-gray-800 leading-tight line-clamp-1">
          {project.title}
        </h3>
        
        {/* Team size indicator - always visible */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1 text-gray-600">
              <Users size={14} className="text-blue-600" />
              <span>Team Capacity</span>
            </span>
            <span className={`font-medium ${isAlmostFull ? 'text-amber-600' : 'text-gray-600'}`}>
              {project.currentMembers?.length || 0}/{project.teamSize}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                memberPercentage === 0 ? 'bg-gray-300' :
                memberPercentage < 30 ? 'bg-blue-500' :
                memberPercentage < 75 ? 'bg-green-500' : 
                memberPercentage < 100 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${memberPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Description - expandable on mobile */}
        <div className="mt-3">
          <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {project.description}
          </p>
          {project.description && project.description.length > 100 && (
            <button 
              className="text-xs text-blue-600 mt-1 font-medium hover:underline" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
        
        {/* Project Meta Info - 2 columns on mobile */}
        <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-400" />
            <span>{project.duration || 'Ongoing'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Tag size={14} className="text-gray-400" />
            <span className="truncate">
              {project.skills?.slice(0, 2).join(', ') || 'Various skills needed'}
            </span>
          </div>
        </div>
        
        {/* Action buttons - Stack on mobile, side by side on larger screens */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center">
          <Link 
            href={`/projects/${project.id}`}
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm py-2.5 px-4 rounded-lg transition-colors font-medium w-full"
          >
            View Details
            <ChevronRight size={16} />
          </Link>
          
          {user && project.currentMembers?.length < project.teamSize && (
            <button 
              className="flex items-center justify-center gap-1 border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 text-sm py-2.5 px-4 rounded-lg transition-colors font-medium w-full"
              onClick={(e) => {
                e.preventDefault();
                // Implement your join project logic here
              }}
            >
              <Users size={16} />
              Join Team
            </button>
          )}
        </div>
        
        {/* Social interactions - touch-friendly */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Award size={14} className="text-gray-400" />
            <span>{project.difficulty || 'Intermediate'}</span>
          </div>
          
          <button
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              // Implement share functionality here
              navigator.share?.({
                title: project.title,
                text: project.description,
                url: `/projects/${project.id}`
              }).catch(err => console.error('Error sharing:', err));
            }}
          >
            <Share2 size={14} />
            <span className="sm:inline hidden">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}