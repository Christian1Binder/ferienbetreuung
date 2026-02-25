import { useStore } from '../../store.js';
import { AdminLayout } from './layout.js';

export function ModuleEditor({ id, moduleId }) {
    const store = useStore();
    const { courses } = store.getState();
    const course = courses.find(c => c.id === id);
    const module = course?.modules.find(m => m.id === moduleId);

    if (!course || !module) {
        return document.createTextNode('Modul nicht gefunden.');
    }

    const el = document.createElement('div');
    el.className = 'space-y-6';

    el.innerHTML = `
        <div class="flex items-center gap-4">
            <a href="#/admin/course/${course.id}" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                Zurück zum Kurs
            </a>
            <h2 class="text-2xl font-bold text-gray-900">Modul bearbeiten</h2>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                <input type="text" id="module-title" value="${module.title}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
            </div>
        </div>

        <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">Lektionen</h3>
            <button id="add-lesson-btn" class="flex items-center gap-2 px-3 py-2 bg-awo-red text-white rounded-md hover:bg-awo-dark transition-colors text-sm font-medium">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Lektion hinzufügen
            </button>
        </div>

        <div class="space-y-4" id="lessons-list">
            ${module.lessons.length === 0 ? '<p class="text-gray-500 italic">Noch keine Lektionen vorhanden.</p>' : ''}
            ${module.lessons.map((lesson, idx) => `
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <h4 class="font-medium text-gray-900">${lesson.title}</h4>
                        <p class="text-sm text-gray-500">${lesson.description || 'Keine Beschreibung'}</p>
                    </div>
                    <div class="flex gap-2">
                        <a href="#/admin/course/${course.id}/module/${module.id}/lesson/${lesson.id}" class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                            <i data-lucide="edit" class="w-4 h-4"></i>
                            Bearbeiten
                        </a>
                        <button class="delete-lesson-btn text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors" data-id="${lesson.id}">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    setTimeout(() => {
        const titleInput = el.querySelector('#module-title');
        titleInput.addEventListener('change', (e) => store.updateModule(course.id, module.id, { title: e.target.value }));

        el.querySelector('#add-lesson-btn').addEventListener('click', () => {
            const newId = `lesson-${Date.now()}`;
            store.addLesson(course.id, module.id, {
                id: newId,
                title: 'Neue Lektion',
                description: '',
                content: '',
                videoUrl: '',
                order: module.lessons.length + 1,
                quiz: {
                    id: `quiz-${newId}`,
                    title: 'Quiz',
                    questions: [],
                    passingScore: 1
                }
            });
            window.location.hash = `#/admin/course/${course.id}/module/${module.id}/lesson/${newId}`;
        });

        el.querySelectorAll('.delete-lesson-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lessonId = e.currentTarget.dataset.id;
                if (confirm('Lektion löschen?')) {
                    store.deleteLesson(course.id, module.id, lessonId);
                    window.location.reload();
                }
            });
        });
    }, 0);

    return el;
}

export function renderModuleEditor(params) {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(AdminLayout(ModuleEditor(params)));
}
