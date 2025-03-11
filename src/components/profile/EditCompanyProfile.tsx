// src/components/profile/EditCompanyProfile.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CompanyProfile } from '@/types/user';

interface EditCompanyProfileProps {
  onCancel: () => void;
  onComplete: () => void;
}

export default function EditCompanyProfile({ onCancel, onComplete }: EditCompanyProfileProps) {
  const { profile, updateUserProfile } = useAuth();
  const companyProfile = profile as CompanyProfile;
  
  const [formData, setFormData] = useState({
    companyName: companyProfile?.companyName || '',
    industry: companyProfile?.industry || '',
    description: companyProfile?.description || '',
    websiteUrl: companyProfile?.websiteUrl || '',
    location: companyProfile?.location || '',
    employeeCount: companyProfile?.employeeCount?.toString() || '',
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
        companyName: formData.companyName,
        industry: formData.industry,
        description: formData.description,
        websiteUrl: formData.websiteUrl,
        location: formData.location,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : undefined,
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
          Edit Company Profile
        </h3>
        <p className="max-w-2xl mt-1 text-sm text-gray-500">
          Update your company information and details.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-6 border-t border-gray-200 sm:px-6">
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
            placeholder="e.g., TechInnovate Inc."
          />
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <input
            type="text"
            name="industry"
            id="industry"
            value={formData.industry}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Technology, Healthcare, Finance"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Company Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe your company, mission, and values"
          />
        </div>
        
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            type="url"
            name="websiteUrl"
            id="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://example.com"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., San Francisco, CA"
          />
        </div>
        
        <div>
          <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">
            Number of Employees
          </label>
          <input
            type="number"
            name="employeeCount"
            id="employeeCount"
            min="1"
            value={formData.employeeCount}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 50"
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