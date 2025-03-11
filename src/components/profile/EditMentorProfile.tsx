// src/components/profile/EditMentorProfile.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MentorProfile } from '@/types/user';

interface EditMentorProfileProps {
  onCancel: () => void;
  onComplete: () => void;
}

export default function EditMentorProfile({ onCancel, onComplete }: EditMentorProfileProps) {
  const { profile, updateUserProfile } = useAuth();
  const mentorProfile = profile as MentorProfile;
  
  const [formData, setFormData] = useState({
    specialization: mentorProfile?.specialization || '',
    skills: mentorProfile?.skills?.join(', ') || '',
    bio: mentorProfile?.bio || '',
    experience: mentorProfile?.experience?.toString() || '',
    companyName: mentorProfile?.companyName || '',
    position: mentorProfile?.position || '',
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
      const updatedProfile = {
        specialization: formData.specialization,
        skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()) : [],
        bio: formData.bio,
        experience: formData.experience ? parseInt(formData.experience) : undefined,
        companyName: formData.companyName,
        position: formData.position,
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
          Edit Mentor Profile
        </h3>
        <p className="max-w-2xl mt-1 text-sm text-gray-500">
          Update your mentorship details and professional information.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-6 border-t border-gray-200 sm:px-6">
        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
            Specialization
          </label>
          <input
            type="text"
            name="specialization"
            id="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Front-end Development, Machine Learning"
          />
        </div>
        
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            id="skills"
            value={formData.skills}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., JavaScript, React, Node.js"
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
            placeholder="Tell us about your professional journey and mentoring philosophy"
          />
        </div>
        
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Google, Microsoft"
          />
        </div>
        
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="text"
            name="position"
            id="position"
            value={formData.position}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Senior Software Engineer, Tech Lead"
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
            placeholder="e.g., 8"
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