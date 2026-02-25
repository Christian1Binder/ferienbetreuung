// Sidebar Component
import store from '../store.js';

export function Sidebar() {
    const { user } = store.getState();

    const navItems = [
        { label: 'Dashboard', icon: 'layout-dashboard', path: '#/dashboard' },
        { label: 'Meine Kurse', icon: 'book-open', path: '#/course/' + (store.getState().courses[0]?.id || '') },
        { label: 'Zertifikate', icon: 'graduation-cap', path: '#/certificate' },
    ];

    const currentHash = window.location.hash;

    const el = document.createElement('aside');
    el.className = 'w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col fixed inset-y-0 left-0 pt-16 z-0';

    el.innerHTML = `
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
            ${navItems.map(item => `
                <a href="${item.path}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentHash.startsWith(item.path.replace('#','')) ? 'bg-red-50 text-awo-red' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}">
                    <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                    ${item.label}
                </a>
            `).join('')}
        </nav>

        <div class="p-4 border-t border-gray-100">
             <button id="logout-btn" class="group flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-awo-red transition-colors">
                 <i data-lucide="log-out" class="w-5 h-5 text-gray-400 group-hover:text-awo-red"></i>
                 Abmelden
             </button>
             <div class="mt-2 pt-2 border-t border-gray-100 text-center">
                 <a href="#/admin/login" class="text-xs text-gray-400 hover:text-gray-600">Admin Login</a>
             </div>
        </div>
    `;

    setTimeout(() => {
        el.querySelector('#logout-btn')?.addEventListener('click', () => {
            store.logout();
            window.location.hash = '#/';
        });
    }, 0);

    return el;
}
