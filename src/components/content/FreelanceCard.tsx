// src/components/content/FreelanceCard.tsx
import { FreelanceProject } from '@/types/content';
import Link from 'next/link';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

export default function FreelanceCard({ project }: { project: FreelanceProject }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-xl font-bold">{project.title}</h3>
      <p className="text-gray-600 mt-2 line-clamp-2">{project.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Budget: {project.budget}
          </span>
          <Link 
            href={`/freelance_projects/${project.id}`}
            className="text-blue-500 hover:underline"
          >
            View Details
          </Link>
        </div>
        <div className="flex gap-2">
          <SaveButton contentId={project.id!} contentType="freelance_projects" />
          <ShareButton contentId={project.id!} contentType="freelance_projects" />
        </div>
      </div>
    </div>
  );
}