// src/components/notifications/StudentPageCollegeCard.tsx
import Link from 'next/link';
import {  StudentProfile } from '@/types/user';
import { College } from '@/types/college';

interface Props {
  college: College;
  studentProfile?: StudentProfile;
}

export default function StudentPageCollegeCard({ college, studentProfile }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{college.name}</h3>
          {college.createdAt && (
            <span className="text-sm text-gray-500">
              Joined: {new Date(college.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

          
        {/* // In StudentPageCollegeCard component */}
        {studentProfile?.uid && !college.students?.map(s => s.toString()).includes(studentProfile.uid) && (
  <p className="text-red-500">Membership verification failed</p>
)}

        {/* // Add these fallbacks in your card component */}
<h3 className="text-xl font-semibold">
  {college.name || 'Unnamed College'}
</h3>
<p className="text-gray-600">
  {college.description || 'No description available'}
</p>
        <p className="mb-4 text-gray-600 line-clamp-3">{college.description}</p>

        {studentProfile && (
          <div className="p-4 mb-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Your Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Major:</span>{' '}
                <span className="text-gray-900">
                  {studentProfile.major || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Year:</span>{' '}
                <span className="text-gray-900">
                  {studentProfile.year || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        )}

        {college.courses && college.courses.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Available Courses</h4>
            <div className="flex flex-wrap gap-2">
              {college.courses.map((course) => (
                <span
                  key={course}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 text-sm">
          {college.websiteUrl && (
            <Link
              href={college.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              College Website
            </Link>
          )}
          {college.contactEmail && (
            <Link
              href={`mailto:${college.contactEmail}`}
              className="text-blue-600 hover:text-blue-700"
            >
              Contact College
            </Link>
          )}
        </div>
      </div>

      {college.location && (
        <div className="p-4 mt-auto bg-gray-50">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {college.location}
          </p>
        </div>
      )}
    </div>
  );
}