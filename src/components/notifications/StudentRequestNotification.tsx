import React from 'react';
import { JoinRequest } from '@/types/college';

interface StudentRequestNotificationProps {
  request: JoinRequest;
}

const StudentRequestNotification: React.FC<StudentRequestNotificationProps> = ({ request }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {request.status === 'accepted' ? 'Request Accepted' : 'Request Rejected'}
          </h3>
          <p className="text-sm text-gray-500">
            College: {request.collegeName || 'Unknown College'}
          </p>
          <p className="text-sm text-gray-500">
            Status: {request.status}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          request.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {request.status}
        </span>
      </div>
    </div>
  );
};

export default StudentRequestNotification;