import store from '../../store.js';
import { AdminLayout } from './layout.js';

export function LessonEditor({ id, moduleId, lessonId }) {
    const { courses } = store.getState();
    const course = courses.find(c => c.id === id);
    const module = course?.modules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);

    if (!course || !module || !lesson) {
        return document.createTextNode('Lektion nicht gefunden.');
    }

    const el = document.createElement('div');
    el.className = 'space-y-6';

    el.innerHTML = `
        <div class="flex items-center gap-4">
            <a href="#/admin/course/${course.id}/module/${module.id}" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                Zurück zum Modul
            </a>
            <h2 class="text-2xl font-bold text-gray-900">Lektion bearbeiten</h2>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                <input type="text" id="lesson-title" value="${lesson.title}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                <input type="text" id="lesson-desc" value="${lesson.description || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Video URL (relativ zu root, z.B. videos/demo.mp4)</label>
                <input type="text" id="lesson-video" value="${lesson.videoUrl || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Inhalt (Text)</label>
                <textarea id="lesson-content" rows="5" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">${lesson.content || ''}</textarea>
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

    function renderQuiz() {
        const container = el.querySelector('#quiz-container');
        container.innerHTML = '';

        if (!lesson.quiz) {
            container.innerHTML = `
                <div class="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p class="text-gray-500 mb-4">Noch kein Quiz für diese Lektion.</p>
                    <button id="create-quiz-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-awo-red">
                        Quiz erstellen
                    </button>
                </div>
            `;
            container.querySelector('#create-quiz-btn').addEventListener('click', async () => {
                // To create quiz, we just update the lesson passing score which get_courses interprets as having a quiz?
                // No, we need questions. `save_lesson` only saves title/content/score.
                // We need to add a dummy question or just reload UI?
                // Actually `get_courses` builds quiz object if `lessonQuestions` exist OR `quiz_passing_score` > 0 ?
                // My logic in `get_courses.php`: `if (isset($lessonQuestions[$l['id']]) && count > 0)` -> creates quiz object.
                // So creating a quiz effectively means adding a first question.
                // OR we relax `get_courses.php` to return empty quiz if passing score is set?
                // Let's modify `store.saveQuestion` to handle creating the first question.

                // For now, let's allow adding a question directly.
                // UI says "Quiz erstellen" -> Add first question.

                await store.saveQuestion(lesson.id, {
                    text: 'Neue Frage',
                    type: 'single-choice',
                    answers: []
                });
                // Reload handled by saveQuestion
            });
            return;
        }

        if (lesson.quiz.questions.length === 0) {
             container.innerHTML = '<p class="text-gray-500 italic mb-4">Noch keine Fragen vorhanden.</p>';
        }

        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
        scoreDiv.innerHTML = `
            <label class="block text-sm font-medium text-gray-700 mb-1">Benötigte Punktzahl zum Bestehen</label>
            <input type="number" min="0" value="${lesson.quiz.passingScore}" class="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
        `;
        scoreDiv.querySelector('input').addEventListener('change', (e) => {
             store.updateLesson(course.id, module.id, lesson.id, {
                 quiz: { passingScore: parseInt(e.target.value) || 0 }
             });
        });
        container.appendChild(scoreDiv);

        lesson.quiz.questions.forEach((question, qIdx) => {
            const qCard = document.createElement('div');
            qCard.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-awo-red space-y-4';

            qCard.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1 space-y-2">
                        <label class="text-sm font-bold text-gray-700">Frage ${qIdx + 1}</label>
                        <input type="text" value="${question.text}" class="question-text w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
                        <div class="flex items-center gap-4">
                            <label class="text-sm text-gray-600">Typ:</label>
                            <select class="question-type border border-gray-300 rounded-md px-2 py-1 text-sm bg-white">
                                <option value="single-choice" ${question.type === 'single-choice' ? 'selected' : ''}>Single Choice</option>
                                <option value="multiple-choice" ${question.type === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
                            </select>
                        </div>
                    </div>
                    <button class="delete-question-btn text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors ml-4" data-id="${question.id}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>

                <div class="pl-4 border-l-2 border-gray-100 space-y-2">
                    <div class="flex justify-between items-center">
                        <h5 class="text-sm font-semibold text-gray-600">Antworten</h5>
                        <button class="add-answer-btn flex items-center gap-1 text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-50">
                            <i data-lucide="plus" class="w-3 h-3"></i> Antwort
                        </button>
                    </div>
                    <div class="answers-list space-y-2"></div>
                </div>
            `;

            // Answers
            const answersList = qCard.querySelector('.answers-list');
            question.answers.forEach(answer => {
                const aRow = document.createElement('div');
                aRow.className = 'flex items-center gap-2';
                aRow.innerHTML = `
                    <input type="checkbox" ${answer.isCorrect ? 'checked' : ''} class="answer-correct h-4 w-4 text-awo-red focus:ring-awo-red border-gray-300 rounded">
                    <input type="text" value="${answer.text}" class="answer-text flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-awo-red focus:border-awo-red">
                    <button class="delete-answer-btn text-gray-400 hover:text-red-600">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                `;

                // Answer events logic:
                // We need to save the whole question structure on change.
                // Helper to get current structure and update it.

                const getUpdatedAnswers = () => {
                    // This is tricky because DOM inputs might not match state if we rely on `question.answers`.
                    // But we are rendering from state.
                    // Let's modify the local answer object and save.
                    return question.answers;
                };

                aRow.querySelector('.answer-correct').addEventListener('change', (e) => {
                    answer.isCorrect = e.target.checked;
                    saveQuestionData(question);
                });
                aRow.querySelector('.answer-text').addEventListener('change', (e) => {
                    answer.text = e.target.value;
                    saveQuestionData(question);
                });
                aRow.querySelector('.delete-answer-btn').addEventListener('click', () => {
                    question.answers = question.answers.filter(a => a.id !== answer.id);
                    saveQuestionData(question);
                });

                answersList.appendChild(aRow);
            });

            // Question events
            qCard.querySelector('.question-text').addEventListener('change', (e) => {
                question.text = e.target.value;
                saveQuestionData(question);
            });
            qCard.querySelector('.question-type').addEventListener('change', (e) => {
                question.type = e.target.value;
                saveQuestionData(question);
            });
            qCard.querySelector('.delete-question-btn').addEventListener('click', async (e) => {
                const qId = e.currentTarget.dataset.id;
                if (confirm('Frage löschen?')) {
                    await store.deleteQuestion(qId);
                    // Reload happens automatically
                }
            });
            qCard.querySelector('.add-answer-btn').addEventListener('click', () => {
                question.answers.push({ text: 'Neue Antwort', isCorrect: false });
                saveQuestionData(question);
            });

            container.appendChild(qCard);
        });

        if (window.lucide) window.lucide.createIcons();
    }

    async function saveQuestionData(question) {
        // question object matches JS structure. API expects { lesson_id, id, text, type, answers }
        // JS structure: { id, text, type, answers: [{id, text, isCorrect}] }
        await store.saveQuestion(lesson.id, question);
    }

    setTimeout(() => {
        el.querySelector('#lesson-title').addEventListener('change', (e) => store.updateLesson(course.id, module.id, lesson.id, { title: e.target.value }));
        el.querySelector('#lesson-desc').addEventListener('change', (e) => store.updateLesson(course.id, module.id, lesson.id, { description: e.target.value }));
        el.querySelector('#lesson-video').addEventListener('change', (e) => store.updateLesson(course.id, module.id, lesson.id, { videoUrl: e.target.value }));
        el.querySelector('#lesson-content').addEventListener('change', (e) => store.updateLesson(course.id, module.id, lesson.id, { content: e.target.value }));

        el.querySelector('#add-question-btn').addEventListener('click', async () => {
            await store.saveQuestion(lesson.id, {
                text: 'Neue Frage',
                type: 'single-choice',
                answers: []
            });
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
