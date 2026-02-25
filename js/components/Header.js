// Header Component
import store from '../store.js';

export function Header() {
    const user = store.getState().user;

    const el = document.createElement('header');
    el.className = 'sticky top-0 z-10 bg-white border-b border-gray-200';
    el.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <button id="menu-toggle" class="lg:hidden p-2 text-gray-500 hover:text-gray-700">
                    <i data-lucide="menu"></i>
                </button>
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-awo-red rounded flex items-center justify-center text-white font-bold text-sm tracking-tighter">AWO</div>
                    <span class="font-bold text-gray-900 hidden sm:inline">Lernplattform</span>
                </div>
            </div>

            <div class="flex items-center gap-4">
                ${user ? `
                    <div class="flex items-center gap-3">
                        <div class="text-right hidden sm:block">
                            <p class="text-sm font-medium text-gray-900">${user.name}</p>
                            ${user.facility ? `<p class="text-xs text-gray-500">${user.facility}</p>` : ''}
                        </div>
                        <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    return el;
}
