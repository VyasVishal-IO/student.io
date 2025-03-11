// src/components/profile/EditTeacherProfile.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TeacherProfile } from '@/types/user';

interface EditTeacherProfileProps {
  onCancel: () => void;
  onComplete: () => void;
}

export default function EditTeacherProfile({ onCancel, onComplete }: EditTeacherProfileProps) {
  const { profile, updateUserProfile } = useAuth();
  const teacherProfile = profile as TeacherProfile;
  
  const [formData, setFormData] = useState({
    department: teacherProfile?.department || '',
    subjects: teacherProfile?.subjects?.join(', ') || '',
    bio: teacherProfile?.bio || '',
    experience: teacherProfile?.experience?.toString() || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert comma-separated strings to arrays and experience to number
      const updatedProfile = {
        department: formData.department,
        subjects: formData.subjects ? formData.subjects.split(',').map(subject => subject.trim()) : [],
        bio: formData.bio,
        experience: formData.experience ? parseInt(formData.experience) : undefined,
      };
      
      await updateUserProfile(updatedProfile);
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Edit Teacher Profile
        </h3>
        <p className="max-w-2xl mt-1 text-sm text-gray-500">
          Update your professional details and teaching information.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-6 border-t border-gray-200 sm:px-6">
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <input
            type="text"
            name="department"
            id="department"
            value={formData.department}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Computer Science Department"
          />
        </div>
        
        <div>
          <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">
            Subjects (comma-separated)
          </label>
          <input
            type="text"
            name="subjects"
            id="subjects"
            value={formData.subjects}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Algorithms, Database Management, Web Development"
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Biography
          </label>
          <textarea
            name="bio"
            id="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Tell us about your teaching experience and interests"
          />
        </div>
        
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Experience (years)
          </label>
          <input
            type="number"
            name="experience"
            id="experience"
            min="0"
            value={formData.experience}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 5"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}