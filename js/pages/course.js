// Course Page
import store from '../store.js';

export function CourseView({ id }) {
    const { courses, user } = store.getState();
    const course = courses.find(c => c.id === id);

    const el = document.createElement('div');
    el.className = 'space-y-8';

    if (!course) {
        el.innerHTML = '<div class="p-8 text-center text-red-600">Kurs nicht gefunden.</div>';
        return el;
    }

    const allLessons = course.modules.flatMap(m => m.lessons);
    const completedLessons = user.completedLessons || [];
    const completedCount = completedLessons.filter(id => allLessons.some(l => l.id === id)).length;
    const progress = (completedCount / allLessons.length) * 100;

    el.innerHTML = `
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">${course.title}</h1>
            <p class="text-gray-600 mb-6">${course.description}</p>

            <div class="space-y-2">
                <div class="flex justify-between text-sm font-medium text-gray-700">
                    <span>Fortschritt</span>
                    <span>${Math.round(progress)}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-awo-red h-2.5 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                </div>
            </div>
        </div>

        <div class="space-y-6">
            ${course.modules.map((module, mIndex) => `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 class="text-lg font-semibold text-gray-900">Modul ${mIndex + 1}: ${module.title}</h2>
                    </div>
                    <div class="divide-y divide-gray-100">
                        ${module.lessons.map(lesson => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            const isLocked = false; // logic for locking if sequential

                            return `
                                <a href="#/course/${course.id}/lesson/${lesson.id}" class="block hover:bg-gray-50 transition-colors">
                                    <div class="px-6 py-4 flex items-center justify-between">
                                        <div class="flex items-center gap-4">
                                            <div class="${isCompleted ? 'text-green-500' : 'text-gray-300'}">
                                                <i data-lucide="${isCompleted ? 'check-circle' : 'circle'}" class="w-6 h-6"></i>
                                            </div>
                                            <div>
                                                <h3 class="font-medium text-gray-900">${lesson.title}</h3>
                                                <p class="text-sm text-gray-500">${lesson.duration ? lesson.duration + ' min' : 'Lektion'}</p>
                                            </div>
                                        </div>
                                        <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                                    </div>
                                </a>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    return el;
}

export function renderCourse(params) {
    import('../components/Layout.js').then(({ Layout }) => {
        const app = document.getElementById('app');
        app.innerHTML = '';
        app.appendChild(Layout(CourseView(params)));
    });
}
