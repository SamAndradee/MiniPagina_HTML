
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN';
}

export interface CodeSnippet {
  id: string;
  language: string;
  code: string;
  authorId: string;
  validatedBy: string[]; // List of User IDs who validated it
  timestamp: number;
}

export interface StudyPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  codeSnippets: CodeSnippet[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string; // "CREATED_POST", "POSTED_CODE", "VALIDATED_CODE"
  targetId: string;
  timestamp: number;
}

export interface RankingEntry {
  userId: string;
  userName: string;
  points: number;
  postsCount: number;
  codesCount: number;
  validationsCount: number;
}

export enum StorageKeys {
  APP_DATA = 'devstudy_data',
  CURRENT_USER = 'devstudy_user'
}

export interface AppData {
  posts: StudyPost[];
  logs: ActivityLog[];
}
