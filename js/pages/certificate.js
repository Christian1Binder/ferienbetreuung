// Certificate Page
import store from '../store.js';

export function Certificate() {
    const { user, courses } = store.getState();
    const course = courses[0]; // Assuming one for now or loop

    // Check if fully completed
    const allLessons = course.modules.flatMap(m => m.lessons);
    const completed = user.completedLessons.length === allLessons.length;

    const el = document.createElement('div');
    el.className = 'max-w-2xl mx-auto space-y-8';

    if (!completed) {
        el.innerHTML = `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i data-lucide="alert-triangle" class="h-5 w-5 text-yellow-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700">
                            Bitte schließen Sie erst alle Lektionen ab, um Ihr Zertifikat zu erhalten.
                        </p>
                    </div>
                </div>
            </div>
            <a href="#/dashboard" class="block w-full text-center text-awo-red hover:text-awo-dark font-medium underline">Zurück zum Dashboard</a>
        `;
        return el;
    }

    el.innerHTML = `
        <div class="bg-white border-8 border-double border-awo-red p-12 text-center shadow-lg relative print:shadow-none print:border-4">
            <div class="absolute top-4 left-4 w-16 h-16 bg-awo-red rounded-full flex items-center justify-center text-white font-bold print:hidden">
                <i data-lucide="award" class="w-8 h-8"></i>
            </div>

            <h1 class="text-4xl font-serif text-gray-900 mb-2 uppercase tracking-widest">Zertifikat</h1>
            <p class="text-gray-500 mb-8 uppercase text-sm tracking-wider">über die erfolgreiche Teilnahme</p>

            <div class="my-8 space-y-2">
                <p class="text-xl text-gray-600">Hiermit wird bestätigt, dass</p>
                <p class="text-3xl font-bold text-gray-900 border-b-2 border-gray-300 inline-block px-8 py-2 font-serif">
                    ${user.name}
                </p>
                ${user.facility ? `<p class="text-gray-500 mt-2">aus der Einrichtung ${user.facility}</p>` : ''}
            </div>

            <p class="text-lg text-gray-600 mb-8">
                den Kurs <strong class="text-gray-900">"${course.title}"</strong><br>
                erfolgreich absolviert hat.
            </p>

            <div class="flex justify-between items-end mt-16 px-8 text-sm text-gray-500">
                <div class="text-center border-t border-gray-300 pt-2 w-48">
                    <p>${new Date().toLocaleDateString('de-DE')}</p>
                    <p>Datum</p>
                </div>
                <div class="text-center border-t border-gray-300 pt-2 w-48">
                    <p class="font-signature text-xl">AWO Team</p>
                    <p>Unterschrift</p>
                </div>
            </div>
        </div>

        <div class="text-center print:hidden space-x-4">
            <button onclick="window.print()" class="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                <i data-lucide="printer" class="w-4 h-4"></i>
                Drucken / PDF speichern
            </button>
            <a href="#/dashboard" class="text-gray-600 hover:text-gray-900 underline">Zurück</a>
        </div>
    `;

    return el;
}

export function renderCertificate() {
    import('../components/Layout.js').then(({ Layout }) => {
        const app = document.getElementById('app');
        app.innerHTML = '';
        app.appendChild(Layout(Certificate()));
    });
}
