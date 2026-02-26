import store from '../../store.js';
import { AdminLayout } from './layout.js';
import { escapeHTML } from '../../utils.js';

export function LessonEditor({ id, moduleId, lessonId }) {
    const { courses } = store.getState();
    const course = courses.find(c => c.id === id);
    const module = course?.modules.find(m => m.id === moduleId);
    // Deep copy lesson to allow local mutation before save (if we fully detached state, but we sync structure actions)
    // Actually we grab the fresh state on re-render.
    const lesson = module?.lessons.find(l => l.id === lessonId);

    if (!course || !module || !lesson) {
        return document.createTextNode('Lektion nicht gefunden.');
    }

    const el = document.createElement('div');
    el.className = 'space-y-6';

    el.innerHTML = `
        <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <a href="#/admin/course/${course.id}/module/${module.id}" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    Zurück zum Modul
                </a>
                <h2 class="text-2xl font-bold text-gray-900">Lektion bearbeiten</h2>
            </div>
            <button id="save-lesson-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                <i data-lucide="save" class="w-4 h-4"></i>
                Lektion Speichern
            </button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                <input type="text" id="lesson-title" value="${escapeHTML(lesson.title)}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                <input type="text" id="lesson-desc" value="${escapeHTML(lesson.description || '')}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Video URL (relativ zu root, z.B. videos/demo.mp4)</label>
                <input type="text" id="lesson-video" value="${escapeHTML(lesson.videoUrl || '')}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Inhalt (Text)</label>
                <textarea id="lesson-content" rows="5" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">${escapeHTML(lesson.content || '')}</textarea>
            </div>
        </div>

        <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">Quiz</h3>
            <button id="add-question-btn" class="flex items-center gap-2 px-3 py-2 bg-awo-red text-white rounded-md hover:bg-awo-dark transition-colors text-sm font-medium">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Frage hinzufügen
            </button>
        </div>

        <div id="quiz-container" class="space-y-6"></div>
    `;

    // Re-fetch fresh state helper
    const getFreshLesson = () => {
        const { courses } = store.getState();
        const c = courses.find(c => c.id === id);
        const m = c?.modules.find(m => m.id === moduleId);
        return m?.lessons.find(l => l.id === lessonId);
    };

    function renderQuiz() {
        const currentLesson = getFreshLesson();
        const container = el.querySelector('#quiz-container');
        container.innerHTML = '';

        if (!currentLesson.quiz) {
            container.innerHTML = `
                <div class="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p class="text-gray-500 mb-4">Noch kein Quiz für diese Lektion.</p>
                    <button id="create-quiz-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-awo-red">
                        Quiz erstellen
                    </button>
                </div>
            `;
            container.querySelector('#create-quiz-btn').addEventListener('click', async () => {
                await store.saveQuestion(currentLesson.id, {
                    text: 'Neue Frage',
                    type: 'single-choice',
                    answers: []
                });
                renderQuiz();
            });
            return;
        }

        if (currentLesson.quiz.questions.length === 0) {
             container.innerHTML = '<p class="text-gray-500 italic mb-4">Noch keine Fragen vorhanden. Nutzen Sie den Button oben rechts.</p>';
        }

        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
        scoreDiv.innerHTML = `
            <div class="flex items-end gap-4">
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Benötigte Punktzahl zum Bestehen</label>
                    <input type="number" id="quiz-score" min="0" value="${currentLesson.quiz.passingScore}" class="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
                </div>
                <button id="save-score-btn" class="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
                    Speichern
                </button>
            </div>
        `;
        scoreDiv.querySelector('#save-score-btn').addEventListener('click', async (e) => {
             const val = scoreDiv.querySelector('#quiz-score').value;
             const btn = e.currentTarget;
             const original = btn.innerText;
             btn.innerText = '...';
             await store.updateLesson(course.id, module.id, lesson.id, {
                 quiz: { passingScore: parseInt(val) || 0 }
             });
             btn.innerText = 'Gespeichert';
             setTimeout(() => btn.innerText = original, 1500);
        });
        container.appendChild(scoreDiv);

        currentLesson.quiz.questions.forEach((question, qIdx) => {
            const qCard = document.createElement('div');
            qCard.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-awo-red space-y-4';

            // We use default value for inputs, not value attribute binding for immediate updates,
            // but here we render fresh from state.

            qCard.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1 space-y-2">
                        <label class="text-sm font-bold text-gray-700">Frage ${qIdx + 1}</label>
                        <input type="text" value="${escapeHTML(question.text)}" class="question-text w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
                        <div class="flex items-center gap-4">
                            <label class="text-sm text-gray-600">Typ:</label>
                            <select class="question-type border border-gray-300 rounded-md px-2 py-1 text-sm bg-white">
                                <option value="single-choice" ${question.type === 'single-choice' ? 'selected' : ''}>Single Choice</option>
                                <option value="multiple-choice" ${question.type === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 ml-4">
                        <button class="save-question-btn text-blue-600 hover:bg-blue-50 p-2 rounded-md transition-colors" title="Frage speichern" data-id="${question.id}">
                            <i data-lucide="save" class="w-4 h-4"></i>
                        </button>
                        <button class="delete-question-btn text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors" title="Frage löschen" data-id="${question.id}">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <div class="pl-4 border-l-2 border-gray-100 space-y-2">
                    <div class="flex justify-between items-center">
                        <h5 class="text-sm font-semibold text-gray-600">Antworten</h5>
                        <button class="add-answer-btn flex items-center gap-1 text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-50" data-id="${question.id}">
                            <i data-lucide="plus" class="w-3 h-3"></i> Antwort
                        </button>
                    </div>
                    <div class="answers-list space-y-2"></div>
                </div>
            `;

            const answersList = qCard.querySelector('.answers-list');
            question.answers.forEach(answer => {
                const aRow = document.createElement('div');
                aRow.className = 'flex items-center gap-2';
                aRow.innerHTML = `
                    <input type="checkbox" ${answer.isCorrect ? 'checked' : ''} class="answer-correct h-4 w-4 text-awo-red focus:ring-awo-red border-gray-300 rounded">
                    <input type="text" value="${escapeHTML(answer.text)}" class="answer-text flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
                    <button class="delete-answer-btn text-gray-400 hover:text-red-600" data-qid="${question.id}" data-aid="${answer.id}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                `;

                // For local updates we don't save immediately.
                // We just let the inputs hold the value.
                // When "Save Question" is clicked, we read from DOM.
                // But wait, "Delete Answer" needs to modify state.

                aRow.querySelector('.delete-answer-btn').addEventListener('click', async () => {
                    // Filter out this answer and save question immediately?
                    // "Structure changes" = immediate save + render
                    const updatedAnswers = question.answers.filter(a => a.id !== answer.id);
                    await store.saveQuestion(currentLesson.id, { ...question, answers: updatedAnswers });
                    renderQuiz();
                });

                answersList.appendChild(aRow);
            });

            // Events

            // Delete Question
            qCard.querySelector('.delete-question-btn').addEventListener('click', async (e) => {
                if (confirm('Frage löschen?')) {
                    await store.deleteQuestion(question.id);
                    renderQuiz();
                }
            });

            // Add Answer
            qCard.querySelector('.add-answer-btn').addEventListener('click', async () => {
                // Add default answer, save, re-render
                const newAnswers = [...question.answers, { text: 'Neue Antwort', isCorrect: false }];
                await store.saveQuestion(currentLesson.id, { ...question, answers: newAnswers });
                renderQuiz();
            });

            // Save Question (Text changes)
            qCard.querySelector('.save-question-btn').addEventListener('click', async (e) => {
                const btn = e.currentTarget;
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '...';

                // Gather data from DOM for this card
                const newText = qCard.querySelector('.question-text').value;
                const newType = qCard.querySelector('.question-type').value;

                // Gather answers from DOM rows
                const answerRows = qCard.querySelectorAll('.answers-list > div');
                const updatedAnswers = Array.from(answerRows).map((row, idx) => {
                    // Match with original ID if possible to preserve?
                    // The DOM order matches render order.
                    // We can rely on render index or better yet, we didn't store ID in DOM for rows except delete btn?
                    // Let's grab ID from the delete button in that row to be safe.
                    const aId = row.querySelector('.delete-answer-btn').dataset.aid;
                    return {
                        id: aId, // passed back to preserve? API handles it?
                        // save_question.php: "Delete old answers... Insert new".
                        // So sending ID is irrelevant for the backend logic I implemented (delete/insert),
                        // BUT for the frontend store update, we might want to keep consistency.
                        // Actually, since backend deletes/inserts, IDs might change!
                        // So `saveQuestion` calls `init()` which reloads from DB.
                        // So we will get new IDs. This is fine.
                        text: row.querySelector('.answer-text').value,
                        isCorrect: row.querySelector('.answer-correct').checked
                    };
                });

                await store.saveQuestion(currentLesson.id, {
                    id: question.id,
                    text: newText,
                    type: newType,
                    answers: updatedAnswers
                });

                btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    if(window.lucide) window.lucide.createIcons();
                }, 1500);

                // We do NOT call renderQuiz() here to avoid losing focus/scroll position if user was typing?
                // But we reloaded the store. So `currentLesson` var is stale.
                // Ideally we should re-render to sync IDs if they changed.
                // Since this is an "explicit save", a re-render is acceptable visual feedback.
                renderQuiz();
            });

            container.appendChild(qCard);
        });

        if (window.lucide) window.lucide.createIcons();
    }

    setTimeout(() => {
        const titleInput = el.querySelector('#lesson-title');
        const descInput = el.querySelector('#lesson-desc');
        const videoInput = el.querySelector('#lesson-video');
        const contentInput = el.querySelector('#lesson-content');
        const saveBtn = el.querySelector('#save-lesson-btn');

        saveBtn.addEventListener('click', async () => {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = 'Speichern...';
            saveBtn.disabled = true;

            const res = await store.updateLesson(course.id, module.id, lesson.id, {
                title: titleInput.value,
                description: descInput.value,
                videoUrl: videoInput.value,
                content: contentInput.value
            });

            if (res.success) {
                saveBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Gespeichert';
                saveBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                saveBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                setTimeout(() => {
                    saveBtn.innerHTML = originalText;
                    saveBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                    saveBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                    saveBtn.disabled = false;
                    if(window.lucide) window.lucide.createIcons();
                }, 2000);
            } else {
                alert('Fehler beim Speichern: ' + res.error);
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }
            if(window.lucide) window.lucide.createIcons();
        });

        el.querySelector('#add-question-btn').addEventListener('click', async () => {
            await store.saveQuestion(lesson.id, {
                text: 'Neue Frage',
                type: 'single-choice',
                answers: []
            });
            renderQuiz();
        });

        renderQuiz();
    }, 0);

    return el;
}

export function renderLessonEditor(params) {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(AdminLayout(LessonEditor(params)));
}
