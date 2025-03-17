// // src/context/AuthContext.tsx
// "use client";

// import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import {
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut,
//   onAuthStateChanged,
//   User as FirebaseUser,
//   ConfirmationResult,
//   User,
// } from 'firebase/auth';
// import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import { UserProfile } from '@/types/user';

// interface AuthContextType {
//   user: FirebaseUser | null;
//   profile: UserProfile | null;
//   loading: boolean;
//   signInWithGoogle: () => Promise<void>;
//   logout: () => Promise<void>;
//   updateUserRole: (username: string, role: string) => Promise<void>;
//   updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
//   signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
//   verifyOTP: (confirmation: ConfirmationResult, otp: string) => Promise<User>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<FirebaseUser | null>(null);
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setUser(user);

//       if (user) {
//         // Fetch user profile from Firestore
//         const userDocRef = doc(db, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists()) {
//           setProfile(userDoc.data() as UserProfile);
//         } else {
//           setProfile(null);
//         }
//       } else {
//         setProfile(null);
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const signInWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);

//       // Check if user exists
//       const userDocRef = doc(db, 'users', result.user.uid);
//       const userDoc = await getDoc(userDocRef);

//       if (!userDoc.exists()) {
//         // Create new user document with base info
//         // Generate unique username based on email
//         const email = result.user.email || '';
//         const username = email.split('@')[0] + Math.floor(Math.random() * 1000);

//         const userData: UserProfile = {
//           uid: result.user.uid,
//           email: result.user.email || '',
//           displayName: result.user.displayName || '',
//           username,
//           role: null,
//           photoURL: result.user.photoURL || '',
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         };

//         await setDoc(userDocRef, {
//           ...userData,
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         });

//         setProfile(userData as UserProfile);
//       }
//     } catch (error) {
//       console.error('Error signing in with Google:', error);
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const updateUserRole = async (username: string, role: string) => {
//     if (!user) return;

//     try {
//       const userDocRef = doc(db, 'users', user.uid);
//       await setDoc(userDocRef, {
//         username,
//         role,
//         updatedAt: serverTimestamp(),
//       }, { merge: true });

//       // Update local state
//       setProfile(prev => prev ? { ...prev, username, role: role as UserProfile['role'] } : null);
//     } catch (error) {
//       console.error('Error updating user role:', error);
//     }
//   };

//   const updateUserProfile = async (data: Partial<UserProfile>) => {
//     if (!user || !profile) return;

//     try {
//       const userDocRef = doc(db, 'users', user.uid);
//       await setDoc(userDocRef, {
//         ...data,
//         updatedAt: serverTimestamp(),
//       }, { merge: true });

//       // Update local state
//       setProfile(prev => prev ? { ...prev, ...data } : null);
//     } catch (error) {
//       console.error('Error updating user profile:', error);
//     }
//   };

//   const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
//     // Implement phone sign-in logic here
//     throw new Error('signInWithPhone not implemented');
//   };

//   const verifyOTP = async (confirmation: ConfirmationResult, otp: string): Promise<User> => {
//     // Implement OTP verification logic here
//     throw new Error('verifyOTP not implemented');
//   };

//   const value = {
//     user,
//     profile,
//     loading,
//     signInWithGoogle,
//     logout,
//     updateUserRole,
//     updateUserProfile,
//     signInWithPhone,
//     verifyOTP,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  ConfirmationResult,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  username?: string;
  role: string | null;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, displayName: string, role: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyOTP: (confirmation: ConfirmationResult, otp: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserRole: (username: string, role: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error: any) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string, role: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        // Generate unique username based on email
        const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
        
        const userProfile: UserProfile = {
          uid: userCredential.user.uid,
          displayName: displayName,
          email: email,
          username: username,
          role: role,
          photoURL: userCredential.user.photoURL || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          ...userProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        setUser(userCredential.user);
        setProfile(userProfile);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user exists
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user document with base info
        // Generate unique username based on email
        const email = result.user.email || '';
        const username = email.split('@')[0] + Math.floor(Math.random() * 1000);

        const userData: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          username,
          role: null,
          photoURL: result.user.photoURL || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(userDocRef, {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setProfile(userData);
      } else {
        setProfile(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw error;
    }
  };

  const updateUserRole = async (username: string, role: string) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        username,
        role,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Update local state
      setProfile(prev => prev ? { ...prev, username, role } : null);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);

      // Optionally update Firebase Auth profile if displayName or photoURL are updated
      if (data.displayName || data.photoURL) {
        await updateProfile(user, {
          displayName: data.displayName,
          photoURL: data.photoURL,
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    }
  };

  const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
    // This is a placeholder for phone authentication implementation
    // You would need to implement this with Firebase Phone Authentication
    throw new Error('signInWithPhone not implemented');
  };

  const verifyOTP = async (confirmation: ConfirmationResult, otp: string): Promise<User> => {
    // This is a placeholder for OTP verification implementation
    throw new Error('verifyOTP not implemented');
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithPhone,
    verifyOTP,
    logout,
    resetPassword,
    updateUserRole,
    updateUserProfile,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};