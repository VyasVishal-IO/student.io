// src/components/content/FreelanceDetail.tsx
import { FreelanceProject } from '@/types/content';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';
import LinkButton from './LinkButton';

export default function FreelanceDetail({ project }: { project: FreelanceProject }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <div className="flex gap-4 mb-6">
        <SaveButton contentId={project.id!} contentType="freelance_projects" />
        <ShareButton contentId={project.id!} contentType="freelance_projects" />
        <LinkButton contentId={project.id!} contentType="freelance_projects" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-bold mb-2">Budget</h3>
          <p>{project.budget}</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Deadline</h3>
          <p>{new Date(project.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="prose max-w-none mb-6">
        <p>{project.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Required Skills</h3>
        <div className="flex gap-2 flex-wrap">
          {project.requiredSkills?.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}