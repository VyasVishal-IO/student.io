// Types for comprehensive project management

export enum ProjectStage {
    IDEATION = 'Ideation',
    PLANNING = 'Planning',
    EXECUTION = 'Execution',
    REVIEW = 'Review',
    COMPLETED = 'Completed'
  }
  
  export enum MemberRole {
    OWNER = 'Owner',
    ADMIN = 'Admin',
    CONTRIBUTOR = 'Contributor',
    OBSERVER = 'Observer'
  }
  
  export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    CRITICAL = 'Critical'
  }
  
  export enum TaskStatus {
    TODO = 'To Do',
    IN_PROGRESS = 'In Progress',
    REVIEW = 'Review',
    DONE = 'Done'
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    skills: string[];
    profilePicture?: string;
    bio?: string;
  }
  
  export interface Project {
    id: string;
    title: string;
    description: string;
    stage: ProjectStage;
    category: string;
    tags: string[];
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    startDate?: Date;
    expectedEndDate?: Date;
    actualEndDate?: Date;
  }
  
  export interface ProjectMember {
    userId: string;
    projectId: string;
    role: MemberRole;
    joinedAt: Date;
    skills: string[];
  }
  
  export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    assignedTo: string; // User ID
    createdBy: string; // User ID
    status: TaskStatus;
    priority: TaskPriority;
    estimatedHours: number;
    actualHours?: number;
    dependencies?: string[]; // Task IDs
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
  }
  
  export interface Milestone {
    id: string;
    projectId: string;
    title: string;
    description: string;
    expectedCompletionDate: Date;
    actualCompletionDate?: Date;
    status: 'Pending' | 'Completed' | 'Delayed';
    tasks: string[]; // Task IDs
  }
  
  export interface Discussion {
    id: string;
    projectId: string;
    authorId: string;
    content: string;
    createdAt: Date;
    replies?: Discussion[];
  }
  
  export interface Contribution {
    id: string;
    projectId: string;
    userId: string;
    title: string;
    description: string;
    type: 'Code' | 'Design' | 'Documentation' | 'Other';
    links?: Array<{title: string, url: string}>;
    attachments?: Array<{name: string, url: string}>;
    visibility: 'Public' | 'Private' | 'Team';
    createdAt: Date;
  }




  // export enum ProjectStage {
  //   IDEATION = 'Ideation',
  //   PLANNING = 'Planning',
  //   IN_PROGRESS = 'In Progress',
  //   COMPLETED = 'Completed'
  // }
  
  // export enum MemberRole {
  //   OWNER = 'Owner',
  //   ADMIN = 'Admin',
  //   MEMBER = 'Member'
  // }
  
  // export interface Project {
  //   id?: string;
  //   title: string;
  //   description: string;
  //   category: string;
  //   tags: string[];
  //   stage: ProjectStage;
  //   imageUrl?: string;
  //   createdBy: string;
  //   createdAt: Date;
  //   updatedAt: Date;
  // }
  
  // export interface ProjectMember {
  //   userId: string;
  //   projectId: string;
  //   role: MemberRole;
  //   joinedAt: Date;
  //   skills: string[];
  // }