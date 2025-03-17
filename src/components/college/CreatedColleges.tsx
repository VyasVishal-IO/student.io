// src/components/college/CreatedColleges.tsx
import Link from 'next/link';
import CreateCollegeFormForTecher from '@/components/college/CreateCollegeFormForTecher'

interface CreatedCollegesProps {
  colleges: any[];
  showCreateCollege: boolean;
  setShowCreateCollege: (show: boolean) => void;
}

export default function CreatedColleges({ 
  colleges, 
  showCreateCollege, 
  setShowCreateCollege 
}: CreatedCollegesProps) {
  return (
    <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Your Created Colleges</h3>
          <button
            onClick={() => setShowCreateCollege(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create College
          </button>
        </div>
        
        {showCreateCollege && (
          <CreateCollegeFormForTecher
            onClose={() => setShowCreateCollege(false)}
          />
        )}

        <div className="mt-4">
          {colleges.length === 0 ? (
            <p className="text-gray-500">No colleges created yet.</p>
          ) : (
            <div className="space-y-4">
              {colleges.map((college) => (
                <div
                  key={college.id}
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <Link
                    href={`/college/${encodeURIComponent(college.name)}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800"
                  >
                    {college.name}
                  </Link>
                  <p className="mt-1 text-sm text-gray-600">{college.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}