
// // src/types/user.ts
// import { UserRole } from './role';

// export interface BaseUser {
//   uid: string;
//   email: string;
//   displayName: string;
//   username: string;
//   role: UserRole | null;
//   createdAt: Date;
//   updatedAt: Date;
//   photoURL?: string;
// }

// export interface StudentProfile extends BaseUser {
//   role: 'student';
//   education?: string;
//   skills?: string[];
//   bio?: string;
//   projects?: string[];
// }

// export interface TeacherProfile extends BaseUser {
//   role: 'teacher';
//   department?: string;
//   subjects?: string[];
//   bio?: string;
//   experience?: number;
// }

// export interface MentorProfile extends BaseUser {
//   role: 'mentor';
//   expertise?: string[];
//   bio?: string;
//   experience?: number;
//   availability?: string;
// }

// export interface CompanyProfile extends BaseUser {
//   role: 'company';
//   industry?: string;
//   location?: string;
//   description?: string;
//   website?: string;
//   size?: string;
// }

// export type UserProfile = StudentProfile | TeacherProfile | MentorProfile | CompanyProfile;

// src/types/user.ts
export type Role = 'student' | 'teacher' | 'mentor' | 'company' | null;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  username: string;
  role: Role;
  createdAt: string | Date;
  updatedAt: string | Date;
  [key: string]: any; // For role-specific fields
}

export interface StudentProfile extends UserProfile {
  major?: string;
  year?: number;
  gpa?: number;
  interests?: string[];
  bio?: string;
  
}

export interface TeacherProfile extends UserProfile {
  department?: string;
  subjects?: string[];
  bio?: string;
  experience?: number;
}

export interface MentorProfile extends UserProfile {
  specialization?: string;
  skills?: string[];
  bio?: string;
  experience?: number;
  companyName?: string;
  position?: string;
}

export interface CompanyProfile extends UserProfile {
  companyName?: string;
  industry?: string;
  description?: string;
  websiteUrl?: string;
  location?: string;
  employeeCount?: number;
}


// types/user.ts (add these types)
export interface FollowRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface UserProfile {
  followers: string[];
  following: string[];
  followRequests: string[];
}