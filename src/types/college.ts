import type { Timestamp } from "firebase/firestore";

export interface College {
  id: string;
  name: string;
  description: string;
  department?: string;
  logoUrl?: string;
  bannerUrl?: string;
  createdBy: string;
  createdAt: Timestamp;
  isPublic?: boolean;
  studentCount: number;
  memberCount: number;
  location?: string;
  aboutHtml?: string;
  courses?: string[];
  students: CollegeMember[];
  teachers: CollegeMember[];
  mentors?: CollegeMember[];
  admins: CollegeMember[];
  publicInfo: PublicInfo;
  privateInfo?: PrivateInfo;
}

export interface CollegeMember {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  role: "teacher" | "student" | "admin";
  joinedAt: Timestamp;
  status: "active" | "inactive";
}

export interface PublicInfo {
  address?: string;
  website?: string;
  contactEmail?: string;
  phone?: string;
}

export interface PrivateInfo {
  resources: Resource[];
  announcements: Announcement[];
}

export interface JoinRequest {
  id: string;
  collegeId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Timestamp;
  processedDate?: Timestamp;
  message?: string;
  collegeName?: string;
  teacherId?: string;
}

export interface Course {
  id: string;
  collegeId: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  department?: string;
  credits?: number;
  syllabus?: string;
  materials?: string[];
  enrolledStudents?: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Announcement {
  id: string;
  collegeId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  important?: boolean;
  attachments?: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface CalendarEvent {
  id: string;
  collegeId: string;
  title: string;
  description?: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  allDay?: boolean;
  location?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  type: "exam" | "class" | "event" | "holiday";
}

export interface Resource {
  id: string;
  collegeId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: Timestamp;
  category?: string;
  tags?: string[];
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  username?: string;
  major?: string;
  department?: string;
}
