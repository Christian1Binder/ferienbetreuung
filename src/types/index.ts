export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string; // URL for the video
  duration?: number; // In minutes
  content?: string; // Text content if any
  order: number;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number; // Minimum correct answers required
}

export type QuestionType = 'single-choice' | 'multiple-choice';

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  answers: Answer[];
}

export interface UserState {
  name: string;
  facility?: string;
  completedLessons: string[]; // List of IDs of completed lessons
  quizScores: Record<string, number>; // Lesson ID -> Score (number of correct answers)
}

declare global {
  interface Window {
    coursesData?: Course[];
  }
}
