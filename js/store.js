export const useStore = (() => {
    // Initial State
    let state = {
        user: JSON.parse(sessionStorage.getItem('user')) || null,
        isAdmin: sessionStorage.getItem('isAdmin') === 'true',
        courses: window.coursesData || [],
        isLoading: false,
        error: null,
    };

    // Listeners for updates
    const listeners = new Set();

    const notify = () => {
        listeners.forEach(cb => cb(state));
    };

    const persistUser = () => {
        if (state.user) {
            sessionStorage.setItem('user', JSON.stringify(state.user));
        } else {
            sessionStorage.removeItem('user');
        }
    };

    const persistAdmin = () => {
        sessionStorage.setItem('isAdmin', state.isAdmin);
    };

    // Store API
    return {
        // Init Logic (maybe unnecessary if state is sync, but good for future async)
        async init() {
            // Check if window.coursesData exists (from <script src="courses.js">)
            if (!state.courses.length && window.coursesData) {
                state.courses = window.coursesData;
            }
            // If window.coursesData failed, try fetching courses.json?
            if (!state.courses.length) {
                try {
                    const res = await fetch('courses.js'); // Actually this is JS... fetch might return text
                    // We rely on the script tag.
                    if (!window.coursesData) {
                        state.error = "Fehler beim Laden der Kursdaten.";
                    }
                } catch (e) {
                    state.error = e.message;
                }
            }
            notify();
        },

        getState() { return state; },

        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener); // unsubscribe
        },

        // --- Auth Actions ---
        login(name, facility) {
            state.user = {
                name,
                facility: facility || '',
                completedLessons: [],
                quizScores: {}
            };
            persistUser();
            notify();
        },

        logout() {
            state.user = null;
            persistUser();
            notify();
        },

        loginAdmin(password) {
            if (password === 'admin') {
                state.isAdmin = true;
                persistAdmin();
                notify();
                return true;
            }
            return false;
        },

        logoutAdmin() {
            state.isAdmin = false;
            persistAdmin();
            notify();
        },

        // --- User Progress Actions ---
        completeLesson(lessonId, score) {
            if (!state.user) return;

            const currentCompleted = state.user.completedLessons || [];
            if (!currentCompleted.includes(lessonId)) {
                state.user.completedLessons = [...currentCompleted, lessonId];
            }

            state.user.quizScores = {
                ...state.user.quizScores,
                [lessonId]: score
            };

            persistUser();
            notify();
        },

        // --- Admin CRUD Actions ---
        // These update the local state. Saving to server happens separately.

        addCourse(course) {
            state.courses = [...state.courses, course];
            notify();
        },

        updateCourse(id, updates) {
            state.courses = state.courses.map(c => c.id === id ? { ...c, ...updates } : c);
            notify();
        },

        deleteCourse(id) {
            state.courses = state.courses.filter(c => c.id !== id);
            notify();
        },

        addModule(courseId, module) {
            state.courses = state.courses.map(c =>
                c.id === courseId ? { ...c, modules: [...c.modules, module] } : c
            );
            notify();
        },

        updateModule(courseId, moduleId, updates) {
            state.courses = state.courses.map(c =>
                c.id === courseId ? {
                    ...c,
                    modules: c.modules.map(m => m.id === moduleId ? { ...m, ...updates } : m)
                } : c
            );
            notify();
        },

        deleteModule(courseId, moduleId) {
            state.courses = state.courses.map(c =>
                c.id === courseId ? {
                    ...c,
                    modules: c.modules.filter(m => m.id !== moduleId)
                } : c
            );
            notify();
        },

        addLesson(courseId, moduleId, lesson) {
            state.courses = state.courses.map(c =>
                c.id === courseId ? {
                    ...c,
                    modules: c.modules.map(m =>
                        m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
                    )
                } : c
            );
            notify();
        },

        updateLesson(courseId, moduleId, lessonId, updates) {
            state.courses = state.courses.map(c =>
                c.id === courseId ? {
                    ...c,
                    modules: c.modules.map(m =>
                        m.id === moduleId ? {
                            ...m,
                            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
                        } : m
                    )
                } : c
            );
            notify();
        },

        deleteLesson(courseId, moduleId, lessonId) {
            state.courses = state.courses.map(c =>
                c.id === courseId ? {
                    ...c,
                    modules: c.modules.map(m =>
                        m.id === moduleId ? {
                            ...m,
                            lessons: m.lessons.filter(l => l.id !== lessonId)
                        } : m
                    )
                } : c
            );
            notify();
        },

        // --- Save to Server ---
        async saveCoursesToServer() {
            try {
                // Prepare the JSON
                const json = JSON.stringify(state.courses);

                // Try to post to PHP script
                const response = await fetch('api/save_courses.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: json
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        return { success: true, message: 'Gespeichert!' };
                    } else {
                        return { success: false, message: result.message || 'Fehler beim Speichern.' };
                    }
                } else {
                     // Fallback: If 404 or 500, suggest manual download
                     return { success: false, fallback: true, message: 'Server-Skript nicht gefunden.' };
                }
            } catch (e) {
                return { success: false, fallback: true, message: e.message };
            }
        },

        // Helper to export file manually
        downloadCoursesFile() {
             const data = `window.coursesData = ${JSON.stringify(state.courses, null, 2)};`;
             const blob = new Blob([data], { type: 'text/javascript' });
             const url = URL.createObjectURL(blob);
             const a = document.createElement('a');
             a.href = url;
             a.download = 'courses.js';
             document.body.appendChild(a);
             a.click();
             document.body.removeChild(a);
             URL.revokeObjectURL(url);
        }
    };
});
