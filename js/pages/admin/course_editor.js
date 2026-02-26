import store from '../../store.js';
import { AdminLayout } from './layout.js';
import { escapeHTML } from '../../utils.js';

export function CourseEditor({ id }) {
    const { courses } = store.getState();
    const course = courses.find(c => c.id === id);

    if (!course) {
        return document.createTextNode('Kurs nicht gefunden.');
    }

    const el = document.createElement('div');
    el.className = 'space-y-6';

    el.innerHTML = `
        <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <a href="#/admin/dashboard" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    Zurück
                </a>
                <h2 class="text-2xl font-bold text-gray-900">Kurs bearbeiten</h2>
            </div>
            <button id="save-course-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                <i data-lucide="save" class="w-4 h-4"></i>
                Speichern
            </button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                <input type="text" id="course-title" value="${escapeHTML(course.title)}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                <textarea id="course-desc" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">${escapeHTML(course.description)}</textarea>
            </div>
        </div>

        <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">Module</h3>
            <button id="add-module-btn" class="flex items-center gap-2 px-3 py-2 bg-awo-red text-white rounded-md hover:bg-awo-dark transition-colors text-sm font-medium">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Modul hinzufügen
            </button>
        </div>

        <div class="space-y-4" id="modules-list">
            ${course.modules.length === 0 ? '<p class="text-gray-500 italic">Noch keine Module vorhanden.</p>' : ''}
            ${course.modules.map(module => `
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <h4 class="font-medium text-gray-900">${escapeHTML(module.title)}</h4>
                        <p class="text-sm text-gray-500">${module.lessons.length} Lektionen</p>
                    </div>
                    <div class="flex gap-2">
                        <a href="#/admin/course/${course.id}/module/${module.id}" class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                            <i data-lucide="edit" class="w-4 h-4"></i>
                            Bearbeiten
                        </a>
                        <button class="delete-module-btn text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors" data-id="${module.id}">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    setTimeout(() => {
        const titleInput = el.querySelector('#course-title');
        const descInput = el.querySelector('#course-desc');
        const saveBtn = el.querySelector('#save-course-btn');

        saveBtn.addEventListener('click', async () => {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = 'Speichern...';
            saveBtn.disabled = true;

            const res = await store.updateCourse(course.id, {
                title: titleInput.value,
                description: descInput.value
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

        el.querySelector('#add-module-btn').addEventListener('click', async () => {
            const res = await store.addModule(course.id, {
                title: 'Neues Modul'
            });
            if (res.success && res.data && res.data.id) {
                window.location.hash = `#/admin/course/${course.id}/module/${res.data.id}`;
            }
        });

        el.querySelectorAll('.delete-module-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const moduleId = e.currentTarget.dataset.id;
                if (confirm('Modul löschen?')) {
                    await store.deleteModule(course.id, moduleId);
                    window.location.reload();
                }
            });
        });
    }, 0);

    return el;
}

export function renderCourseEditor(params) {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(AdminLayout(CourseEditor(params)));
}
