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
        <div class="bg-white p-12 text-center shadow-lg relative print:shadow-none mx-auto print:w-full" style="max-width: 210mm; min-height: 297mm; border: 1px solid #e5e7eb;">
            <!-- Header with Logo -->
            <div class="flex justify-between items-start mb-16">
                <img src="assets/logo.png" alt="AWO Logo" class="h-24 object-contain">
                <div class="text-right text-gray-500 text-sm">
                    <p>Arbeiterwohlfahrt</p>
                    <p>Kreisverband Mittelfranken-Süd e.V.</p>
                </div>
            </div>

            <!-- Title -->
            <div class="mb-12">
                <h1 class="text-5xl font-serif text-gray-900 mb-4 tracking-wider font-bold">ZERTIFIKAT</h1>
                <div class="h-1 w-24 bg-awo-red mx-auto"></div>
            </div>

            <!-- Content -->
            <div class="space-y-8 mb-16">
                <p class="text-xl text-gray-600 uppercase tracking-widest text-sm">Hiermit bestätigen wir, dass</p>

                <div class="py-4">
                    <p class="text-4xl font-bold text-gray-900 font-serif mb-2">
                        ${user.name}
                    </p>
                    ${user.facility ? `<p class="text-lg text-gray-500">${user.facility}</p>` : ''}
                </div>

                <p class="text-xl text-gray-600">
                    die Schulung
                </p>

                <p class="text-3xl text-awo-red font-bold">
                    "${course.title}"
                </p>

                <p class="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
                    erfolgreich absolviert hat. Alle Module und Prüfungen wurden vollständig bearbeitet und bestanden.
                </p>
            </div>

            <!-- Footer / Signatures -->
            <div class="flex justify-between items-end mt-24 px-12">
                <div class="text-center">
                    <div class="border-b border-gray-400 pb-2 w-48 mb-2">
                        <p class="font-medium text-gray-900">${new Date().toLocaleDateString('de-DE')}</p>
                    </div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Datum</p>
                </div>

                <div class="text-center">
                    <div class="border-b border-gray-400 pb-2 w-48 mb-2">
                        <!-- Space for signature or image -->
                        <div class="h-8"></div>
                    </div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Unterschrift / AWO Leitung</p>
                </div>
            </div>

            <!-- Decorative Border Bottom -->
            <div class="absolute bottom-0 left-0 right-0 h-4 bg-awo-red"></div>
        </div>

        <div class="text-center print:hidden space-x-4 py-8">
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
