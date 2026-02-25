// Store Module (Singleton)
const state = {
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    isAdmin: sessionStorage.getItem('isAdmin') === 'true',
    courses: window.coursesData || [],
    isLoading: false,
    error: null,
};

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

// Actions & Methods
export async function init() {
    // Check if window.coursesData exists (from <script src="courses.js">)
    if (!state.courses.length && window.coursesData) {
        state.courses = window.coursesData;
    }
    // If window.coursesData failed, try fetching courses.js (as text, though ideally script tag works)
    if (!state.courses.length) {
        try {
            // This is just a fallback check; if script tag failed, this might not help much unless we parse it manually
            // But let's keep the error reporting
            if (!window.coursesData) {
                state.error = "Fehler beim Laden der Kursdaten.";
            }
        } catch (e) {
            state.error = e.message;
        }
    }
    notify();
}

export function getState() {
    return state;
}

export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

// --- Auth Actions ---
export function login(name, facility) {
    state.user = {
        name,
        facility: facility || '',
        completedLessons: [],
        quizScores: {}
    };
    persistUser();
    notify();
}

export function logout() {
    state.user = null;
    persistUser();
    notify();
}

export function loginAdmin(password) {
    if (password === 'admin') {
        state.isAdmin = true;
        persistAdmin();
        notify();
        return true;
    }
    return false;
}

export function logoutAdmin() {
    state.isAdmin = false;
    persistAdmin();
    notify();
}

// --- User Progress Actions ---
export function completeLesson(lessonId, score) {
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
}

// --- Admin CRUD Actions ---
export function addCourse(course) {
    state.courses = [...state.courses, course];
    notify();
}

export function updateCourse(id, updates) {
    state.courses = state.courses.map(c => c.id === id ? { ...c, ...updates } : c);
    notify();
}

export function deleteCourse(id) {
    state.courses = state.courses.filter(c => c.id !== id);
    notify();
}

export function addModule(courseId, module) {
    state.courses = state.courses.map(c =>
        c.id === courseId ? { ...c, modules: [...c.modules, module] } : c
    );
    notify();
}

export function updateModule(courseId, moduleId, updates) {
    state.courses = state.courses.map(c =>
        c.id === courseId ? {
            ...c,
            modules: c.modules.map(m => m.id === moduleId ? { ...m, ...updates } : m)
        } : c
    );
    notify();
}

export function deleteModule(courseId, moduleId) {
    state.courses = state.courses.map(c =>
        c.id === courseId ? {
            ...c,
            modules: c.modules.filter(m => m.id !== moduleId)
        } : c
    );
    notify();
}

export function addLesson(courseId, moduleId, lesson) {
    state.courses = state.courses.map(c =>
        c.id === courseId ? {
            ...c,
            modules: c.modules.map(m =>
                m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
            )
        } : c
    );
    notify();
}

export function updateLesson(courseId, moduleId, lessonId, updates) {
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
}

export function deleteLesson(courseId, moduleId, lessonId) {
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
}

// --- Save to Server ---
export async function saveCoursesToServer() {
    try {
        const json = JSON.stringify(state.courses);
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
             return { success: false, fallback: true, message: 'Server-Skript nicht gefunden.' };
        }
    } catch (e) {
        return { success: false, fallback: true, message: e.message };
    }
}

export function downloadCoursesFile() {
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

// Default export as object for convenience if needed, but named exports are cleaner
export default {
    init, getState, subscribe, login, logout, loginAdmin, logoutAdmin,
    completeLesson, addCourse, updateCourse, deleteCourse,
    addModule, updateModule, deleteModule,
    addLesson, updateLesson, deleteLesson,
    saveCoursesToServer, downloadCoursesFile
};
