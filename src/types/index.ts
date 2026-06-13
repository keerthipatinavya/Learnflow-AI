// User profile definition
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  streakDays: number;
  totalXP: number;
  joinedDate: string;
  level: number;
  learningTimeMinutes: number;
}

// Media / Content upload status and info
export interface Upload {
  id: string;
  title: string;
  type: 'pdf' | 'url' | 'youtube' | 'text';
  source: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number; // 0 to 100
  createdAt: string;
  fileSize?: string;
}

// Adaptive Course Structure
export interface Course {
  id: string;
  title: string;
  description: string;
  sourceType: Upload['type'];
  thumbnailUrl?: string;
  progress: number; // Percentage 0 - 100
  chaptersCount: number;
  completedChapters: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
  durationMinutes: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  content: string; // Markdown / Rich Text support
  summary: string;
  keyPoints: string[];
  durationMinutes: number;
  isCompleted: boolean;
  diagramUrl?: string;
}

// Flashcards Systems
export interface Flashcard {
  id: string;
  courseId: string;
  front: string;
  back: string;
  box: number; // SuperMemo-2 / Leitner box status (1-5)
  nextReviewDate?: string;
}

// Quizzes & practice test models
export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  selectedAnswerIndex?: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
  totalXP: number;
  timeLimitSeconds?: number;
  score?: number; // Added after submission
}

export interface PracticeTest {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
  isSubmitted: boolean;
  score?: number;
  timeSpentSeconds?: number;
}

// AI Chat Tutor interfaces
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citations?: Array<{
    text: string;
    source: string;
    pageNumber?: number;
  }>;
}

// Voice avatars speaking sessions
export interface VoiceSession {
  sessionId: string;
  status: 'connecting' | 'listening' | 'speaking' | 'idle';
  durationSeconds: number;
  aiTranscript?: string;
  userTranscript?: string;
}

// Gamified progress metrics
export interface DailyActivity {
  day: string; // Short name e.g. "Mon"
  minutes: number;
  xp: number;
}

export interface Progress {
  user: User;
  dailyStreak: number;
  weeklyTargetMinutes: number;
  weeklyCompletedMinutes: number;
  subjectPerformance: Array<{
    subject: string;
    score: number; // 0 to 100
  }>;
  weakAreas: string[];
  strongAreas: string[];
  history: DailyActivity[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeCode: string; // e.g. 'streak-7', 'quiz-master'
  isUnlocked: boolean;
  unlockedAt?: string;
  iconName: string;
  xpReward: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'reminder' | 'recommendation' | 'announcement';
  isRead: boolean;
  timestamp: string;
  metadata?: Record<string, string>;
}

// FastAPI generic API response envelopes
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    details?: string;
  };
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
