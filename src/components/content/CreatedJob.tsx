// src/components/content/CreatedJob.tsx
import { JobOpening } from '@/types/content';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

export default function CreatedJob({ job }: { job: JobOpening }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <div className="mt-2 flex items-center gap-4">
        <span className="text-sm bg-green-100 px-2 py-1 rounded">
          {job.jobType}
        </span>
        <span className="text-sm text-gray-500">{job.location}</span>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2">
          <SaveButton contentId={job.id!} contentType="job_openings" />
          <ShareButton contentId={job.id!} contentType="job_openings" />
        </div>
      </div>
    </div>
  );
}