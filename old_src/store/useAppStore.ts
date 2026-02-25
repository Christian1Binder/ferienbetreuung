import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserState, Course, Module, Lesson } from '../types';
import { courses as initialCourses } from '../data/courses';

interface AppStore {
  user: UserState | null;
  isAdmin: boolean;
  courses: Course[];
  hasLoaded: boolean;
  isLoadingCourses: boolean;
  errorCourses: string | null;
  fetchCourses: () => Promise<void>;
  login: (name: string, facility?: string) => void;
  logout: () => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addModule: (courseId: string, module: Module) => void;
  updateModule: (courseId: string, moduleId: string, module: Partial<Module>) => void;
  deleteModule: (courseId: string, moduleId: string) => void;
  addLesson: (courseId: string, moduleId: string, lesson: Lesson) => void;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  completeLesson: (lessonId: string, score: number) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      courses: initialCourses,
      hasLoaded: false,
      isLoadingCourses: false,
      errorCourses: null,
      fetchCourses: async () => {
        if (get().hasLoaded) {
          return;
        }
        set({ isLoadingCourses: true, errorCourses: null });
        try {
          // Check if coursesData is defined in the window object (injected via courses.js)
          if (typeof window !== 'undefined' && window.coursesData) {
            set({ courses: window.coursesData, hasLoaded: true, isLoadingCourses: false });
          } else {
             // Fallback to fetch if window.coursesData is not available (dev mode mostly)
             try {
                const response = await fetch('courses.json');
                if (response.ok) {
                    const data = await response.json();
                    set({ courses: data, hasLoaded: true, isLoadingCourses: false });
                    return;
                }
             } catch {
                 // Ignore fetch error and proceed to throw
             }
             throw new Error('Keine Kursdaten gefunden (window.coursesData oder courses.json fehlgeschlagen).');
          }
        } catch (error) {
          console.error('Failed to load courses:', error);
          set({
            isLoadingCourses: false,
            errorCourses: 'Kursdaten konnten nicht geladen werden. Bitte prüfen Sie die courses.js Datei.'
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
      loginAdmin: (password) => {
        if (password === 'admin') {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },
      logoutAdmin: () => set({ isAdmin: false }),
      addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
      updateCourse: (id, updated) => set((state) => ({
        courses: state.courses.map((c) => (c.id === id ? { ...c, ...updated } : c))
      })),
      deleteCourse: (id) => set((state) => ({
        courses: state.courses.filter((c) => c.id !== id)
      })),
      addModule: (courseId, module) => set((state) => ({
        courses: state.courses.map((c) =>
          c.id === courseId ? { ...c, modules: [...c.modules, module] } : c
        )
      })),
      updateModule: (courseId, moduleId, updated) => set((state) => ({
        courses: state.courses.map((c) =>
          c.id === courseId ? {
            ...c,
            modules: c.modules.map((m) =>
              m.id === moduleId ? { ...m, ...updated } : m
            )
          } : c
        )
      })),
      deleteModule: (courseId, moduleId) => set((state) => ({
        courses: state.courses.map((c) =>
          c.id === courseId ? {
            ...c,
            modules: c.modules.filter((m) => m.id !== moduleId)
          } : c
        )
      })),
      addLesson: (courseId, moduleId, lesson) => set((state) => ({
        courses: state.courses.map((c) =>
          c.id === courseId ? {
            ...c,
            modules: c.modules.map((m) =>
              m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
            )
          } : c
        )
      })),
      updateLesson: (courseId, moduleId, lessonId, updated) => set((state) => ({
        courses: state.courses.map((c) =>
          c.id === courseId ? {
            ...c,
            modules: c.modules.map((m) =>
              m.id === moduleId ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === lessonId ? { ...l, ...updated } : l
                )
              } : m
            )
          } : c
        )
      })),
      deleteLesson: (courseId, moduleId, lessonId) => set((state) => ({
        courses: state.courses.map((c) =>
          c.id === courseId ? {
            ...c,
            modules: c.modules.map((m) =>
              m.id === moduleId ? {
                ...m,
                lessons: m.lessons.filter((l) => l.id !== lessonId)
              } : m
            )
          } : c
        )
      })),
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
