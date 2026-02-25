import { useStore } from '../../store.js';
import { AdminLayout } from './layout.js';

export function AdminDashboard() {
    const store = useStore();
    const { courses } = store.getState();

    const el = document.createElement('div');
    el.className = 'space-y-6';

    const header = document.createElement('div');
    header.className = 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4';
    header.innerHTML = `
        <div>
            <h2 class="text-2xl font-bold text-gray-900">Kursverwaltung</h2>
            <p class="text-gray-600">Verwalten Sie hier Ihre Kurse und Inhalte.</p>
        </div>
        <div class="flex gap-2">
            <button id="save-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <i data-lucide="save" class="w-4 h-4"></i>
                Speichern
            </button>
            <button id="add-course-btn" class="flex items-center gap-2 px-4 py-2 bg-awo-red text-white rounded-md hover:bg-awo-dark transition-colors">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Neuer Kurs
            </button>
        </div>
    `;
    el.appendChild(header);

    const feedback = document.createElement('div');
    feedback.id = 'save-feedback';
    feedback.className = 'hidden p-4 rounded-md';
    el.appendChild(feedback);

    const list = document.createElement('div');
    list.className = 'grid gap-4';

    if (courses.length === 0) {
        list.innerHTML = `
            <div class="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p class="text-gray-500">Keine Kurse vorhanden.</p>
            </div>
        `;
    } else {
        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4';
            card.innerHTML = `
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">${course.title}</h3>
                    <p class="text-sm text-gray-600 line-clamp-1">${course.description}</p>
                    <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span class="flex items-center gap-1">
                            <i data-lucide="file-json" class="w-3 h-3"></i>
                            ID: ${course.id}
                        </span>
                        <span>${course.modules.length} Module</span>
                    </div>
                </div>

                <div class="flex gap-2 w-full sm:w-auto">
                    <a href="#/admin/course/${course.id}" class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                        Bearbeiten
                    </a>
                    <button class="delete-btn flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 border border-red-200 rounded-md hover:bg-red-50 text-sm font-medium text-red-600 transition-colors" data-id="${course.id}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                        Löschen
                    </button>
                </div>
            `;
            list.appendChild(card);
        });
    }
    el.appendChild(list);

    // Event Listeners
    setTimeout(() => {
        el.querySelector('#add-course-btn').addEventListener('click', () => {
            const newId = `course-${Date.now()}`;
            store.addCourse({
                id: newId,
                title: 'Neuer Kurs',
                description: 'Beschreibung hier eingeben...',
                modules: []
            });
            window.location.hash = `#/admin/course/${newId}`;
        });

        el.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('Möchten Sie diesen Kurs wirklich löschen?')) {
                    store.deleteCourse(id);
                }
            });
        });

        el.querySelector('#save-btn').addEventListener('click', async () => {
            const btn = el.querySelector('#save-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> Speicher...';
            btn.disabled = true;

            const result = await store.saveCoursesToServer();

            feedback.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800', 'bg-yellow-100', 'text-yellow-800');

            if (result.success) {
                feedback.classList.add('bg-green-100', 'text-green-800');
                feedback.innerText = result.message;
            } else {
                if (result.fallback) {
                     feedback.classList.add('bg-yellow-100', 'text-yellow-800');
                     feedback.innerHTML = `
                        <p><strong>Server-Speicherung fehlgeschlagen:</strong> ${result.message}</p>
                        <p class="mt-2">Laden Sie die Datei manuell herunter:</p>
                        <button id="download-fallback" class="mt-2 bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-black">courses.js herunterladen</button>
                     `;
                     setTimeout(() => {
                         document.getElementById('download-fallback')?.addEventListener('click', () => {
                             store.downloadCoursesFile();
                         });
                     }, 0);
                } else {
                    feedback.classList.add('bg-red-100', 'text-red-800');
                    feedback.innerText = 'Fehler: ' + result.message;
                }
            }

            btn.innerHTML = originalText;
            btn.disabled = false;
        });
    }, 0);

    return el;
}

export function renderAdminDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(AdminLayout(AdminDashboard()));
}
