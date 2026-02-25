// Dashboard Page
import store from '../store.js';

export function Dashboard() {
    const { user, courses } = store.getState();

    const el = document.createElement('div');
    el.className = 'space-y-8';

    if (!user) {
        window.location.hash = '#/';
        return el;
    }

    if (courses.length === 0) {
        el.innerHTML = '<p class="text-gray-500">Keine Kurse verfügbar.</p>';
        return el;
    }

    const cards = courses.map(course => {
        const allLessons = course.modules.flatMap(m => m.lessons);
        const totalLessons = allLessons.length;
        const completedLessons = user.completedLessons.filter(id => allLessons.some(l => l.id === id)).length;
        const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        return `
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-awo-red hover:shadow-md transition-shadow p-6">
                    <div class="mb-4">
                        <span class="text-xs font-bold tracking-wider text-awo-red uppercase">Kurs</span>
                        <h2 class="text-xl font-bold text-gray-900 mt-1">${course.title}</h2>
                        <p class="text-gray-600 mt-2 text-sm line-clamp-3">${course.description}</p>
                    </div>

                    <div class="mt-auto space-y-4">
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Fortschritt</span>
                                <span class="font-medium text-gray-900">${Math.round(progress)}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="bg-awo-red h-2.5 rounded-full" style="width: ${progress}%"></div>
                            </div>
                        </div>

                        <a href="#/course/${course.id}" class="block w-full bg-awo-red text-white py-2 px-4 rounded-md text-center hover:bg-awo-dark transition-colors font-medium group">
                            <span class="flex items-center justify-center gap-2">
                                ${progress > 0 ? 'Weiterlernen' : 'Kurs starten'}
                                <i data-lucide="play-circle" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                            </span>
                        </a>
                    </div>
                </div>

                <div class="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="font-bold text-gray-900 mb-4">Deine Übersicht</h3>
                    <div class="space-y-4 flex-1">
                        <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>
                            <div>
                                <p class="text-sm font-bold text-gray-900">${completedLessons} / ${totalLessons}</p>
                                <p class="text-xs text-gray-600">Lektionen abgeschlossen</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <i data-lucide="clock" class="w-5 h-5 text-blue-600"></i>
                            <div>
                                <p class="text-sm font-bold text-gray-900">${course.modules.length}</p>
                                <p class="text-xs text-gray-600">Module insgesamt</p>
                            </div>
                        </div>
                    </div>

                    ${progress === 100 ? `
                        <a href="#/certificate" class="mt-4 block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-center hover:bg-gray-50 transition-colors font-medium">
                            Zertifikat ansehen
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    el.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Hallo, ${user.name}!</h1>
                <p class="text-gray-600">Willkommen zurück auf deiner Lernplattform.</p>
            </div>
        </div>
        ${cards}
    `;

    return el;
}

export function renderDashboard() {
    import('../components/Layout.js').then(({ Layout }) => {
        const app = document.getElementById('app');
        app.innerHTML = '';
        app.appendChild(Layout(Dashboard()));
    });
}
