// Routes configuration
import { renderDashboard } from './pages/dashboard.js';
import { renderCourse } from './pages/course.js';
import { renderLesson } from './pages/lesson.js';
import { renderAdminLogin } from './pages/admin/login.js';
import { renderAdminDashboard } from './pages/admin/dashboard.js';
import { renderCourseEditor } from './pages/admin/course_editor.js';
import { renderModuleEditor } from './pages/admin/module_editor.js';
import { renderLessonEditor } from './pages/admin/lesson_editor.js';
import { renderWelcome } from './pages/welcome.js';
import { renderCertificate } from './pages/certificate.js';
import { useStore } from './store.js';

const routes = {
    '/': renderWelcome,
    '/dashboard': renderDashboard,
    '/course/:id': renderCourse,
    '/course/:id/lesson/:lessonId': renderLesson,
    '/certificate': renderCertificate,
    '/admin/login': renderAdminLogin,
    '/admin/dashboard': renderAdminDashboard,
    '/admin/course/:id': renderCourseEditor,
    '/admin/course/:id/module/:moduleId': renderModuleEditor,
    '/admin/course/:id/module/:moduleId/lesson/:lessonId': renderLessonEditor
};

const appDiv = document.getElementById('app');

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('load', handleRoute);
    handleRoute(); // Initial load
}

function handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, query] = hash.split('?');

    // Check Auth
    const store = useStore();
    const { user, isAdmin } = store.getState();

    // Route Guards
    if (path.startsWith('/admin') && path !== '/admin/login' && !isAdmin) {
        window.location.hash = '/admin/login';
        return;
    }

    if (path !== '/' && !path.startsWith('/admin') && !user) {
        window.location.hash = '/';
        return;
    }

    // Match Route
    let matchedRoute = null;
    let params = {};

    for (const routePattern in routes) {
        const regex = new RegExp(`^${routePattern.replace(/:[^\s/]+/g, '([^/]+)')}$`);
        const match = path.match(regex);

        if (match) {
            matchedRoute = routes[routePattern];
            // Extract params
            const paramNames = (routePattern.match(/:[^\s/]+/g) || []).map(n => n.slice(1));
            paramNames.forEach((name, index) => {
                params[name] = match[index + 1];
            });
            break;
        }
    }

    if (matchedRoute) {
        // Render
        appDiv.innerHTML = '';
        const pageContent = matchedRoute(params);
        if (pageContent instanceof HTMLElement) {
            appDiv.appendChild(pageContent);
        } else if (typeof pageContent === 'string') {
            appDiv.innerHTML = pageContent;
        }

        // Re-initialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    } else {
        appDiv.innerHTML = '<div class="p-8 text-center">404 - Seite nicht gefunden</div>';
    }
}

export function navigate(path) {
    window.location.hash = path;
}
