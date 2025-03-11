// src/components/content/CreatedProject.tsx
import { Project } from '@/types/content';
import Link from 'next/link';
import SaveButton from './SaveButton';

export default function CreatedProject({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-xl font-bold">{project.title}</h3>
      <p className="text-gray-600 mt-2">{project.description}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Link href={`/projects/${project.id}`} className="text-blue-500">
            View Details
          </Link>
          <SaveButton contentId={project.id || ""} contentType="projects" />
          <button className="text-gray-500">
            {/* Add share icon */}
            Share
          </button>
        </div>
        <span className="text-sm text-gray-500">
          {project.teamSize} members
        </span>
      </div>
    </div>
  );
}