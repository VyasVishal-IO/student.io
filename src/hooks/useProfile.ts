// src/hooks/useProfile.ts
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { Role, UserProfile } from '@/types/user';
import { UserRole } from '@/types/role';

export const useProfile = () => {
  const { profile, updateUserProfile, loading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Check if the user has a specific role
  const hasRole = useCallback((role: Role): boolean => {
    return profile?.role === role;
  }, [profile]);
  
  // Update specific profile fields based on role
  const updateProfile = useCallback(async <T extends Partial<UserProfile>>(data: T) => {
    setIsUpdating(true);
    
    try {
      const updatedProfile = await updateUserProfile(data);
      return updatedProfile;
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [updateUserProfile]);
  
  // Get specific profile data based on role
  const getProfileByRole = useCallback(() => {
    if (!profile) return null;
    
    switch (profile.role) {
      case 'student':
        return {
          ...profile,
          type: 'student' as const
        };
      case 'teacher':
        return {
          ...profile,
          type: 'teacher' as const
        };
      case 'mentor':
        return {
          ...profile,
          type: 'mentor' as const
        };
      case 'company':
        return {
          ...profile,
          type: 'company' as const
        };
      default:
        return profile;
    }
  }, [profile]);
  
  // Check if profile is complete (has all required fields based on role)
  const isProfileComplete = useCallback((): boolean => {
    if (!profile || !profile.role) return false;
    
    const roleSpecificFields: Record<UserRole, string[]> = {
      student: ['major', 'year'],
      teacher: ['department', 'subjects'],
      mentor: ['specialization', 'skills'],
      company: ['companyName', 'industry'],
    };
    
    const requiredFields = roleSpecificFields[profile.role];
    
    return requiredFields.every(field => 
      profile[field as keyof UserProfile] !== undefined && 
      profile[field as keyof UserProfile] !== null &&
      profile[field as keyof UserProfile] !== ''
    );
  }, [profile]);
  
  return {
    profile,
    profileData: getProfileByRole(),
    loading: loading || isUpdating,
    isUpdating,
    updateProfile,
    hasRole,
    isProfileComplete,
  };
};