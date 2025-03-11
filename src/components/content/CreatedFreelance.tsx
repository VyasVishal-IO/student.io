// src/components/content/CreatedFreelance.tsx
import { FreelanceProject } from '@/types/content';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

export default function CreatedFreelance({ project }: { project: FreelanceProject }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-xl font-bold">{project.title}</h3>
      <p className="text-gray-600 mt-2 line-clamp-2">{project.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2">
          <span className="text-sm text-gray-500">
            Budget: {project.budget}
          </span>
          <SaveButton contentId={project.id!} contentType="freelance_projects" />
          <ShareButton contentId={project.id!} contentType="freelance_projects" />
        </div>
      </div>
    </div>
  );
}