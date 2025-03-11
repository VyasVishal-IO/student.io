import { FieldValue } from "firebase/firestore";
import { z } from "zod"; // Assuming you're using Zod for validation

// Base Content Interface
export interface BaseContent {
  id?: string;
  authorId: string;
  createdAt: Date | FieldValue; // Allow FieldValue for Firestore timestamps
  updatedAt: Date | FieldValue;
  tags?: string[];
}

// Post Interface
export interface Post extends BaseContent {
  imageUrl?: string;
  description: string;
  likes: number;
  comments: string[]; // Array of comment IDs or strings
}

// Tweet Interface
export interface Tweet extends BaseContent {
  content: string;
}

// Article Interface
export interface Article extends BaseContent {
  title: string;
  content: string;
  links: string[];
}

// Notes Interface
export interface Notes extends BaseContent {
  title: string;
  content: string;
  links: string[];
}

// Event Interface
export interface Event extends BaseContent {
  title: string;
  description: string;
  imageUrl?: string;
  startDate: Date | string;
  endDate: Date | string;
  links: Array<{ title: string; url: string }>;
}

// Job Opening Interface
export interface JobOpening extends BaseContent {
  title: string;
  description: string;
  applyLink: string;
  jobType: "internship" | "full-time" | "part-time";
  duration?: string;
  salaryExpectation?: string;
  location?: string;
}

// Freelance Project Interface
export interface FreelanceProject extends BaseContent {
  title: string;
  description: string;
  budget: string;
  deadline: Date;
  requiredSkills: string[];
}

// User Interface
export interface User {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
}

// Project Link Interface
export interface ProjectLink {
  title: string;
  url: string;
}

// Join Request Interface
export interface JoinRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: Date;
}

// Joined Student Interface
export interface JoinedStudent {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: Date;
}

// Project Interface
export interface Project extends BaseContent {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  teamSize: number;
  currentMembers: string[];
  links: ProjectLink[];
  ownerId: string;
  joinRequests: JoinRequest[];
  joinedStudents: JoinedStudent[];
  createdBy: string;
}

// Contribution Interface
export interface Contribution {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  content: string;
  links: Array<{ title: string; url: string }>;
  files: string[];
  userEmail: string;
  userAvatar?: string;
  createdAt: Date | FieldValue;
  updatedAt: Date | FieldValue;
}

// Notification Interface
export interface Notification {
  id?: string;
  type: "joinRequest" | "contributionUpdate" | "projectUpdate";
  recipientId: string;
  senderId?: string;
  senderName?: string;
  userEmail?: string;
  userAvatar?: string;
  projectId?: string;
  projectTitle?: string;
  contentId?: string;
  contentType?: string;
  read: boolean;
  createdAt: Date | FieldValue;
  message?: string;
}

// Props Interfaces
export interface ProjectDetailsProps {
  projectId: string;
}

export interface ContributionBoxProps {
  projectId: string;
  isTeamMember: boolean;
}

export interface JoinRequestNotificationProps {
  projectId: string;
  joinRequests: JoinRequest[];
}

export interface ProjectEditModalProps {
  project: Project;
  onUpdate: (updatedProject: Project) => void;
}

// Validation Schemas
export const ProjectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  category: z.string().min(1, "Please select a category"),
  teamSize: z
    .number()
    .min(1, "Team size must be at least 1")
    .max(10, "Team size cannot exceed 10"),
  links: z
    .array(
      z.object({
        title: z.string().min(1, "Link title is required"),
        url: z.string().url("Invalid URL"),
      })
    )
    .optional(),
});

// Enum for Project Categories
export enum ProjectCategory {
  WEB_DEVELOPMENT = "Web Development",
  MOBILE_APP = "Mobile App",
  MACHINE_LEARNING = "Machine Learning",
  DATA_SCIENCE = "Data Science",
  CYBERSECURITY = "Cybersecurity",
  OTHER = "Other",
}