// Lesson Page
import { useStore } from '../store.js';

export function LessonView({ id, lessonId }) {
    const store = useStore();
    const { courses, user } = store.getState();
    const course = courses.find(c => c.id === id);
    const module = course?.modules.find(m => m.lessons.some(l => l.id === lessonId));
    const lesson = module?.lessons.find(l => l.id === lessonId);

    const el = document.createElement('div');
    el.className = 'grid lg:grid-cols-3 gap-8';

    if (!lesson) {
        el.innerHTML = '<div class="col-span-3 text-center text-red-600">Lektion nicht gefunden.</div>';
        return el;
    }

    const isVideo = lesson.videoUrl && (lesson.videoUrl.endsWith('.mp4') || lesson.videoUrl.endsWith('.webm'));
    const isCompleted = user.completedLessons.includes(lesson.id);

    // Main Content Column
    const contentCol = document.createElement('div');
    contentCol.className = 'lg:col-span-2 space-y-6';

    // Video Player
    if (lesson.videoUrl) {
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'aspect-video bg-black rounded-xl overflow-hidden shadow-lg';
        if (isVideo) {
            videoWrapper.innerHTML = `
                <video controls class="w-full h-full">
                    <source src="${lesson.videoUrl}" type="video/mp4">
                    Ihr Browser unterstützt dieses Videoformat nicht.
                </video>
            `;
        } else {
            // Assume YouTube or similar if not local file
            // Need to handle embed URL logic if needed, but for now simple iframe
            videoWrapper.innerHTML = `<iframe src="${lesson.videoUrl}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>`;
        }
        contentCol.appendChild(videoWrapper);
    }

    // Text Content
    const textContent = document.createElement('div');
    textContent.className = 'bg-white rounded-xl p-6 shadow-sm border border-gray-200 prose max-w-none';
    textContent.innerHTML = `
        <h1 class="text-2xl font-bold text-gray-900 mb-4">${lesson.title}</h1>
        <div class="text-gray-600 leading-relaxed space-y-4">
            ${lesson.content ? lesson.content.split('\n').map(p => `<p>${p}</p>`).join('') : ''}
        </div>
    `;
    contentCol.appendChild(textContent);

    // Sidebar Column (Quiz)
    const sidebarCol = document.createElement('div');
    sidebarCol.className = 'space-y-6';

    const quizCard = document.createElement('div');
    quizCard.className = 'bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-24';

    if (lesson.quiz) {
        quizCard.innerHTML = `
            <div class="flex items-center gap-2 mb-4">
                <i data-lucide="help-circle" class="w-5 h-5 text-awo-red"></i>
                <h2 class="font-bold text-gray-900">Wissenscheck</h2>
            </div>
        `;

        const quizForm = document.createElement('form');
        quizForm.className = 'space-y-6';

        lesson.quiz.questions.forEach((q, idx) => {
            const qEl = document.createElement('div');
            qEl.className = 'space-y-3';
            qEl.innerHTML = `
                <p class="font-medium text-gray-900">${idx + 1}. ${q.text}</p>
                <div class="space-y-2">
                    ${q.answers.map(a => `
                        <div class="relative">
                            <input type="${q.type === 'multiple-choice' ? 'checkbox' : 'radio'}"
                                   name="q-${q.id}"
                                   id="a-${a.id}"
                                   value="${a.id}"
                                   class="peer sr-only quiz-option">
                            <label for="a-${a.id}"
                                   class="flex items-center w-full p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors peer-checked:border-awo-red peer-checked:bg-red-50 peer-checked:text-awo-red">
                                <span class="w-2 h-2 rounded-full border border-gray-400 mr-3 peer-checked:bg-awo-red peer-checked:border-awo-red"></span>
                                <span class="text-sm">${a.text}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
            `;
            quizForm.appendChild(qEl);
        });

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'w-full bg-awo-red text-white py-2 px-4 rounded-md hover:bg-awo-dark transition-colors font-medium mt-4';
        submitBtn.innerText = 'Antworten prüfen';
        quizForm.appendChild(submitBtn);

        const feedback = document.createElement('div');
        feedback.className = 'mt-4 hidden';
        quizForm.appendChild(feedback);

        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            let score = 0;
            let allCorrect = true;

            lesson.quiz.questions.forEach(q => {
                const userAnswers = formData.getAll(`q-${q.id}`);
                const correctAnswers = q.answers.filter(a => a.isCorrect).map(a => a.id);

                // Check if user selected exactly the correct answers
                const isCorrect = userAnswers.length === correctAnswers.length &&
                                  userAnswers.every(val => correctAnswers.includes(val));

                if (isCorrect) score++;
                else allCorrect = false;
            });

            if (score >= lesson.quiz.passingScore) {
                feedback.innerHTML = `
                    <div class="p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        <p class="font-bold">Herzlichen Glückwunsch!</p>
                        <p class="text-sm">Du hast den Test bestanden.</p>
                    </div>
                `;
                store.completeLesson(lesson.id, score);

                // Show next button
                setTimeout(() => {
                   const nextLesson = findNextLesson(course, lesson.id);
                   if (nextLesson) {
                       const nextBtn = document.createElement('a');
                       nextBtn.href = `#/course/${course.id}/lesson/${nextLesson.id}`;
                       nextBtn.className = 'block w-full text-center bg-gray-900 text-white py-2 px-4 rounded-md mt-4 hover:bg-gray-800';
                       nextBtn.innerHTML = 'Nächste Lektion <i data-lucide="arrow-right" class="inline w-4 h-4 ml-1"></i>';
                       quizForm.appendChild(nextBtn);
                       if(window.lucide) window.lucide.createIcons();
                   } else {
                       const finishBtn = document.createElement('a');
                       finishBtn.href = `#/dashboard`;
                       finishBtn.className = 'block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-green-700';
                       finishBtn.innerHTML = 'Kurs abschließen';
                       quizForm.appendChild(finishBtn);
                   }
                }, 500);

            } else {
                feedback.innerHTML = `
                    <div class="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        <p class="font-bold">Nicht bestanden</p>
                        <p class="text-sm">Bitte überprüfe deine Antworten und versuche es erneut.</p>
                    </div>
                `;
            }
            feedback.classList.remove('hidden');
        });

        quizCard.appendChild(quizForm);
    } else {
        // No Quiz - just mark as complete button
        quizCard.innerHTML = `
            <div class="text-center space-y-4">
                <p class="text-gray-600">Kein Quiz für diese Lektion.</p>
                <button id="mark-complete" class="w-full bg-awo-red text-white py-2 px-4 rounded-md hover:bg-awo-dark transition-colors font-medium">
                    Als erledigt markieren
                </button>
            </div>
        `;
        setTimeout(() => {
            quizCard.querySelector('#mark-complete')?.addEventListener('click', () => {
                store.completeLesson(lesson.id, 0);
                window.location.hash = `#/course/${course.id}`;
            });
        }, 0);
    }

    sidebarCol.appendChild(quizCard);

    el.appendChild(contentCol);
    el.appendChild(sidebarCol);

    return el;
}

function findNextLesson(course, currentLessonId) {
    const allLessons = course.modules.flatMap(m => m.lessons);
    const idx = allLessons.findIndex(l => l.id === currentLessonId);
    return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
}

export function renderLesson(params) {
    import('../components/Layout.js').then(({ Layout }) => {
        const app = document.getElementById('app');
        app.innerHTML = '';
        app.appendChild(Layout(LessonView(params)));
    });
}
