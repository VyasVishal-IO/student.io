// src/components/college/CollegeHeader.tsx

import React from 'react';
import Image from 'next/image';
import { College } from '@/types/college';
import { requestToJoinCollege } from '@/services/collegeService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface CollegeHeaderProps {
  college: College;
  isOwner: boolean;
  isMember: boolean;
  onEdit: () => void;
}

const CollegeHeader: React.FC<CollegeHeaderProps> = ({ 
  college, 
  isOwner, 
  isMember, 
  onEdit 
}) => {
  const { profile } = useAuth();
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [hasRequested, setHasRequested] = React.useState(false);
  
  const handleJoinRequest = async () => {
    if (!profile) {
      toast.error('You need to be logged in to join a college');
      return;
    }
    
    try {
      setIsRequesting(true);
      
      await requestToJoinCollege(college.id, {
        studentId: profile.uid,
        studentName: profile.displayName || '',
        studentEmail: profile.email || '',
      });
      
      setHasRequested(true);
      toast.success('Join request sent successfully!');
    } catch (error) {
      console.error('Error sending join request:', error);
      toast.error('Failed to send join request');
    } finally {
      setIsRequesting(false);
    }
  };
  
  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-red-500 to-red-700 relative">
        {college.bannerUrl && (
          <Image
            src={college.bannerUrl}
            alt={`${college.name} banner`}
            layout="fill"
            objectFit="cover"
            priority
          />
        )}
      </div>
      
      {/* College Logo and Info */}
      <div className="px-4">
        <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-4 relative z-10">
          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg shadow-lg overflow-hidden border-4 border-white">
            <Image
              src={college.logoUrl}
              alt={`${college.name} logo`}
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          
          {/* College Name and Verification */}
          <div className="flex-1 mt-2 md:mt-0 md:ml-4 md:mb-2">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold">{college.name}</h1>
              <svg className="w-5 h-5 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-300 mt-1">{college.description}</p>
          </div>
          
          {/* Actions */}
          <div className="mt-4 md:mt-0 md:ml-4 flex flex-col md:flex-row gap-2">
            {isOwner ? (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : isMember ? (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md cursor-default"
              >
                Member
              </button>
            ) : hasRequested ? (
              <button
                className="px-4 py-2 bg-yellow-600 text-white rounded-md cursor-default"
              >
                Request Sent
              </button>
            ) : (
              <button
                onClick={handleJoinRequest}
                disabled={isRequesting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                  isRequesting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isRequesting ? 'Sending...' : 'Join College'}
              </button>
            )}
            
            <a
              href={college.publicInfo.website || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-center"
            >
              Visit website
            </a>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-4">
          <div>Education • {college.department || 'Multiple Departments'}</div>
          <div>{college.publicInfo.address || 'Location not specified'}</div>
          {/* <div>{college.studentCount} students • {members.length} followers</div> */}
        </div>
      </div>
    </div>
  );
};

export default CollegeHeader;