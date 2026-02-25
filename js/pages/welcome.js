// Welcome Page
export function Welcome() {
    const el = document.createElement('div');
    el.className = 'min-h-screen flex items-center justify-center bg-gray-50 p-4';

    el.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-t-4 border-awo-red">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-awo-red rounded-lg mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4 tracking-tighter">AWO</div>
                <h1 class="text-2xl font-bold text-gray-900">Willkommen</h1>
                <p class="text-gray-600 mt-2">Bitte geben Sie Ihre Daten ein, um die Schulung zu beginnen.</p>
            </div>

            <form id="login-form" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ihr Name *</label>
                    <input type="text" name="name" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red" placeholder="Vorname Nachname">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Einrichtung (optional)</label>
                    <input type="text" name="facility" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red" placeholder="z.B. AWO Hort Nürnberg">
                </div>
                <button type="submit" class="w-full bg-awo-red text-white py-2 px-4 rounded-md hover:bg-awo-dark transition-colors font-medium">Starten</button>
            </form>

            <div class="mt-8 text-center border-t pt-4 text-sm text-gray-500">
                <a href="#/admin/login" class="hover:text-awo-red hover:underline transition-colors">Admin Login</a>
            </div>
        </div>
    `;

    setTimeout(() => {
        const form = el.querySelector('#login-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const name = formData.get('name').trim();
                const facility = formData.get('facility').trim();

                if (name) {
                    import('../store.js').then(({ useStore }) => {
                        useStore().login(name, facility);
                        window.location.hash = '#/dashboard';
                    });
                }
            });
        }
    }, 0);

    return el;
}

export function renderWelcome() {
    return Welcome();
}
