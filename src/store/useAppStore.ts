import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserState, Course } from '../types';
import { courses as initialCourses } from '../data/courses';

interface AppStore {
  user: UserState | null;
  courses: Course[];
  isLoadingCourses: boolean;
  errorCourses: string | null;
  fetchCourses: () => Promise<void>;
  login: (name: string, facility?: string) => void;
  logout: () => void;
  completeLesson: (lessonId: string, score: number) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      courses: initialCourses,
      isLoadingCourses: false,
      errorCourses: null,
      fetchCourses: async () => {
        set({ isLoadingCourses: true, errorCourses: null });
        try {
          const response = await fetch('courses.json');
          if (!response.ok) {
            throw new Error('Fehler beim Laden der Kursdaten');
          }
          const data = await response.json();
          set({ courses: data, isLoadingCourses: false });
        } catch (error) {
          console.error('Failed to load courses:', error);
          set({
            isLoadingCourses: false,
            errorCourses: 'Kursdaten konnten nicht geladen werden. Bitte prüfen Sie die courses.json Datei.'
          });
        }
      },
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
