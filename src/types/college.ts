// src/types/college.ts

export interface College {
  students: CollegeMember[];
  teachers: CollegeMember[];
  mentors: CollegeMember[];
  admins: CollegeMember[];
    id: string;
    adminId: string;
    role: 'teacher' | 'student' | 'admin';
    courses: string[];
    websiteUrl?: string;
    contactEmail?: string;
    phone?: string;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl?: string;
    createdAt: number; // timestamp
    teacherId: string;
    teacherName: string;
    department?: string;
    studentCount: number;
    memberCount: number;
    bannerImage?: string;
    location?: string;
    aboutHtml?: string;
    isPublic?: boolean;
    publicInfo: {
      address?: string;
      website?: string;
      contactEmail?: string;
      phone?: string;
    };
    privateInfo?: {
      resources: Resource[];
      announcements: Announcement[];
    };
  }
  
  export interface Resource {
    id: string;
    title: string;
    description: string;
    url: string;
    type: 'document' | 'video' | 'link' | 'other';
    createdAt: number;
  }
  
  export interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: number;
  }
  
// src/types/college.ts
export interface JoinRequest {
  id: string;
  collegeId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  processedDate?: Date;
  message?: string;
  collegeName?: string;
  teacherId?: string;
}
  
  export interface CollegeMember {
    id: string;
    userId: string;
    displayName: string;
    email: string;
    role: 'teacher' | 'student' | 'admin';
    joinedAt: number;
    status: 'active' | 'inactive';
  }