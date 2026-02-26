import store from '../../store.js';
import { AdminLayout } from './layout.js';
import { escapeHTML } from '../../utils.js';

export function ModuleEditor({ id, moduleId }) {
    const { courses } = store.getState();
    const course = courses.find(c => c.id === id);
    const module = course?.modules.find(m => m.id === moduleId);

    if (!course || !module) {
        return document.createTextNode('Modul nicht gefunden.');
    }

    const el = document.createElement('div');
    el.className = 'space-y-6';

    el.innerHTML = `
        <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <a href="#/admin/course/${course.id}" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    Zurück zum Kurs
                </a>
                <h2 class="text-2xl font-bold text-gray-900">Modul bearbeiten</h2>
            </div>
            <button id="save-module-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                <i data-lucide="save" class="w-4 h-4"></i>
                Speichern
            </button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                <input type="text" id="module-title" value="${escapeHTML(module.title)}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
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
                        <h4 class="font-medium text-gray-900">${escapeHTML(lesson.title)}</h4>
                        <p class="text-sm text-gray-500">${escapeHTML(lesson.description || 'Keine Beschreibung')}</p>
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
        const saveBtn = el.querySelector('#save-module-btn');

        saveBtn.addEventListener('click', async () => {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = 'Speichern...';
            saveBtn.disabled = true;

            const res = await store.updateModule(course.id, module.id, {
                title: titleInput.value
            });

            if (res.success) {
                saveBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Gespeichert';
                saveBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                saveBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                setTimeout(() => {
                    saveBtn.innerHTML = originalText;
                    saveBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                    saveBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                    saveBtn.disabled = false;
                    if(window.lucide) window.lucide.createIcons();
                }, 2000);
            } else {
                alert('Fehler beim Speichern: ' + res.error);
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }
            if(window.lucide) window.lucide.createIcons();
        });

        el.querySelector('#add-lesson-btn').addEventListener('click', async () => {
            const res = await store.addLesson(course.id, module.id, {
                title: 'Neue Lektion'
            });
            if (res.success && res.data && res.data.id) {
                window.location.hash = `#/admin/course/${course.id}/module/${module.id}/lesson/${res.data.id}`;
            }
        });

        el.querySelectorAll('.delete-lesson-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const lessonId = e.currentTarget.dataset.id;
                if (confirm('Lektion löschen?')) {
                    await store.deleteLesson(course.id, module.id, lessonId);
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
