// src/lib/auth.ts
import { 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
  } from 'firebase/auth';
  import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
  import { auth, db } from './firebase';
  import { Role, UserProfile } from '@/types/user';
  import { UserRole } from '@/types/role';
  
  // Generate a unique username from the email
  export const generateUsername = (email: string): string => {
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${baseUsername}${randomSuffix}`;
  };
  
  // Sign in with Google
  export const signInWithGoogle = async (): Promise<FirebaseUser> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };
  
  // Create a user profile if it doesn't exist
  export const createUserProfileIfNeeded = async (user: FirebaseUser): Promise<UserProfile> => {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        username: generateUsername(user.email || ''),
        UserRole: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await setDoc(userRef, newProfile);
      return newProfile;
    }
    
    return docSnap.data() as UserProfile;
  };
  
  // Update user profile
  export const updateProfile = async (uid: string, profileData: Partial<UserProfile>): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    });
  };
  
  // Set user role
  export const setUserRole = async (uid: string, UserRole: Role): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        UserRole,
      updatedAt: new Date().toISOString(),
    });
  };
  
  // Get user profile
  export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    
    return null;
  };
  
  // Log out user
  export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
  };
  
  // Check if user is authenticated
  export const isAuthenticated = (): boolean => {
    return !!auth.currentUser;
  };
  
  // Subscribe to auth state changes
  export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void): (() => void) => {
    return onAuthStateChanged(auth, callback);
  };