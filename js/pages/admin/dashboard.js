import store from '../../store.js';
import { AdminLayout } from './layout.js';

export function AdminDashboard() {
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
            <button id="add-course-btn" class="flex items-center gap-2 px-4 py-2 bg-awo-red text-white rounded-md hover:bg-awo-dark transition-colors">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Neuer Kurs
            </button>
        </div>
    `;
    el.appendChild(header);

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
        el.querySelector('#add-course-btn').addEventListener('click', async () => {
            const btn = el.querySelector('#add-course-btn');
            btn.disabled = true;
            btn.innerHTML = '...';

            // Send empty data to create default
            const res = await store.addCourse({
                title: 'Neuer Kurs',
                description: 'Beschreibung hier eingeben...'
            });

            if (res.success && res.data && res.data.id) {
                window.location.hash = `#/admin/course/${res.data.id}`;
            } else {
                alert('Fehler beim Erstellen: ' + (res.error || 'Unbekannt'));
                btn.disabled = false;
                btn.innerHTML = '<i data-lucide="plus" class="w-4 h-4"></i> Neuer Kurs';
            }
        });

        el.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('Möchten Sie diesen Kurs wirklich löschen?')) {
                    await store.deleteCourse(id);
                    // Store reload handled in deleteCourse, UI update via reactive render?
                    // Since router isn't fully reactive, we force reload
                    window.location.reload();
                }
            });
        });
    }, 0);

    return el;
}

export function renderAdminDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(AdminLayout(AdminDashboard()));
}
