// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  signInWithGoogle,
  createUserProfileIfNeeded,
  updateProfile,
  setUserRole,
  getUserProfile,
  logoutUser,
  subscribeToAuthChanges
} from '@/lib/auth';
import { Role, UserProfile } from '@/types/user';


export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // src/hooks/useAuth.ts (continued)
  const router = useRouter();

  // Load user profile when the user state changes
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google method
  const login = useCallback(async () => {
    try {
      setLoading(true);
      const firebaseUser = await signInWithGoogle();
      const userProfile = await createUserProfileIfNeeded(firebaseUser);
      
      if (!userProfile.role) {
        router.push('/role-selection');
      } else {
        router.push(`/home/${userProfile.role}/${userProfile.username}`);
      }
      
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Set user role method
  const setRole = useCallback(async (role: Role) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await setUserRole(user.uid, role);
      
      // Update local profile state
      const updatedProfile = await getUserProfile(user.uid);
      setProfile(updatedProfile);
      
      if (updatedProfile?.username) {
        router.push(`/home/${role}/${updatedProfile.username}`);
      }
    } catch (error) {
      console.error('Error setting role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  // Update user profile method
  const updateUserProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await updateProfile(user.uid, profileData);
      
      // Update local profile state
      const updatedProfile = await getUserProfile(user.uid);
      setProfile(updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Logout method
  const logout = useCallback(async () => {
    try {
      await logoutUser();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, [router]);

  return {
    user,
    profile,
    loading,
    login,
    logout,
    setRole,
    updateUserProfile,
    isAuthenticated: !!user,
  };
};