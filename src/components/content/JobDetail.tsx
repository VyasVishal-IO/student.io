// src/components/content/JobDetail.tsx
import { JobOpening } from '@/types/content';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

export default function JobDetail({ job }: { job: JobOpening }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <div className="flex gap-4 mb-4">
        <SaveButton contentId={job.id!} contentType="job_openings" />
        <ShareButton contentId={job.id!} contentType="job_openings" />
      </div>
      
      <div className="prose max-w-none">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-bold">Job Type</h3>
            <p>{job.jobType}</p>
          </div>
          <div>
            <h3 className="font-bold">Location</h3>
            <p>{job.location || 'Remote'}</p>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mt-6">Description</h2>
        <p>{job.description}</p>
        
        <a href={job.applyLink} target="_blank" className="inline-block mt-6 bg-blue-500 text-white px-6 py-3 rounded">
          Apply Now
        </a>
      </div>
    </div>
  );
}