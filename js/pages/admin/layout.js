// Layout Wrapper for Admin
import { useStore } from '../../store.js';

export function AdminLayout(content) {
    const store = useStore();
    const { isAdmin } = store.getState();

    if (!isAdmin) {
        window.location.hash = '#/admin/login';
        return document.createElement('div');
    }

    const el = document.createElement('div');
    el.className = 'min-h-screen bg-gray-100 flex flex-col';

    el.innerHTML = `
        <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <h1 class="text-xl font-bold text-gray-900">Admin Bereich</h1>
                </div>

                <div class="flex items-center gap-2">
                    <a href="#/dashboard" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors text-sm">
                        <i data-lucide="home" class="w-4 h-4"></i>
                        <span class="hidden sm:inline">Zurück zur Seite</span>
                    </a>
                    <button id="admin-logout-btn" class="flex items-center gap-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-md hover:bg-red-50 border border-red-200 transition-colors text-sm">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                        <span class="hidden sm:inline">Abmelden</span>
                    </button>
                </div>
            </div>
        </header>

        <main class="flex-1 w-full p-4 lg:p-8">
            <div class="max-w-7xl mx-auto" id="admin-content"></div>
        </main>
    `;

    el.querySelector('#admin-content').appendChild(content);

    setTimeout(() => {
        el.querySelector('#admin-logout-btn')?.addEventListener('click', () => {
            store.logoutAdmin();
            window.location.hash = '#/admin/login';
        });
    }, 0);

    return el;
}
