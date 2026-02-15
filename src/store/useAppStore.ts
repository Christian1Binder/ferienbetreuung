import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserState, Course } from '../types';
import { courses as initialCourses } from '../data/courses';

interface AppStore {
  user: UserState | null;
  courses: Course[];
  login: (name: string, facility?: string) => void;
  logout: () => void;
  completeLesson: (lessonId: string, score: number) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      courses: initialCourses,
      login: (name, facility) => set({
        user: {
          name,
          facility: facility || '',
          completedLessons: [],
          quizScores: {}
        }
      }),
      logout: () => set({ user: null }),
      completeLesson: (lessonId, score) => set((state) => {
        if (!state.user) return {};
        const newCompleted = state.user.completedLessons.includes(lessonId)
          ? state.user.completedLessons
          : [...state.user.completedLessons, lessonId];

        return {
          user: {
            ...state.user,
            completedLessons: newCompleted,
            quizScores: {
              ...state.user.quizScores,
              [lessonId]: score
            }
          }
        };
      })
    }),
    {
      name: 'awo-platform-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
