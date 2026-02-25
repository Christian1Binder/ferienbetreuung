import store from '../../store.js';

export function AdminLogin() {
    const el = document.createElement('div');
    el.className = 'min-h-screen flex items-center justify-center bg-gray-50 p-4';

    el.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 class="text-xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>

            <form id="admin-login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
                    <input type="password" name="password" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
                </div>

                <p id="error-msg" class="text-red-600 text-sm hidden"></p>

                <button type="submit" class="w-full bg-awo-red text-white py-2 px-4 rounded-md hover:bg-awo-dark transition-colors font-medium">
                    Anmelden
                </button>
            </form>
            <div class="mt-4 text-center">
                <a href="#/" class="text-sm text-gray-500 hover:text-gray-900">Zurück zur Startseite</a>
            </div>
        </div>
    `;

    setTimeout(() => {
        el.querySelector('#admin-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const password = formData.get('password');

            if (store.loginAdmin(password)) {
                window.location.hash = '#/admin/dashboard';
            } else {
                const err = el.querySelector('#error-msg');
                err.textContent = 'Falsches Passwort';
                err.classList.remove('hidden');
            }
        });
    }, 0);

    return el;
}

export function renderAdminLogin() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(AdminLogin());
}
