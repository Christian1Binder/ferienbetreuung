import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, ArrowLeft, Trash2 } from 'lucide-react';
import type { Quiz, Question, Answer, QuestionType } from '../../types';

const generateId = (prefix: string) => `${prefix}-${Date.now()}`;

export function LessonEditor() {
  const { courseId, moduleId, lessonId } = useParams<{ courseId: string, moduleId: string, lessonId: string }>();
  const navigate = useNavigate();
  const courses = useAppStore((state) => state.courses);
  const updateLesson = useAppStore((state) => state.updateLesson);

  const course = courses.find((c) => c.id === courseId);
  const module = course?.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);

  if (!course || !module || !lesson) {
    return <div className="p-8 text-center text-red-600">Lektion nicht gefunden.</div>;
  }

  const handleUpdate = (updates: Partial<typeof lesson>) => {
    updateLesson(course.id, module.id, lesson.id, updates);
  };

  const ensureQuiz = () => {
    if (!lesson.quiz) {
      handleUpdate({
        quiz: {
          id: `quiz-${lesson.id}`,
          title: 'Quiz',
          questions: [],
          passingScore: 1
        }
      });
    }
  };

  const updateQuiz = (updates: Partial<Quiz>) => {
    if (!lesson.quiz) return;
    handleUpdate({ quiz: { ...lesson.quiz, ...updates } });
  };

  const addQuestion = () => {
    ensureQuiz();
    const newQuestion: Question = {
      id: generateId('q'),
      text: 'Neue Frage',
      type: 'single-choice',
      answers: []
    };
    // Need to cast/assert non-null because ensureQuiz relies on a render cycle or immediate update?
    // Wait, updateLesson updates the store immediately.
    // But local `lesson` variable is from `courses` which is from store hook.
    // Zustand hooks trigger re-render. So `lesson.quiz` might be null in *this* render frame if I just called ensureQuiz.
    // However, I can pass the new quiz object directly if I know I just created it.
    // Actually, ensureQuiz updates the store. This component will re-render.
    // So the user clicks "Add Quiz" first if it's missing?
    // Let's make "Add Question" safer.
    const currentQuiz = lesson.quiz || {
        id: `quiz-${lesson.id}`,
        title: 'Quiz',
        questions: [],
        passingScore: 1
    };

    handleUpdate({
        quiz: {
            ...currentQuiz,
            questions: [...currentQuiz.questions, newQuestion]
        }
    });
  };

  const updateQuestion = (qId: string, updates: Partial<Question>) => {
    if (!lesson.quiz) return;
    const newQuestions = lesson.quiz.questions.map(q => q.id === qId ? { ...q, ...updates } : q);
    updateQuiz({ questions: newQuestions });
  };

  const deleteQuestion = (qId: string) => {
    if (!lesson.quiz) return;
    const newQuestions = lesson.quiz.questions.filter(q => q.id !== qId);
    updateQuiz({ questions: newQuestions });
  };

  const addAnswer = (qId: string) => {
    if (!lesson.quiz) return;
    const question = lesson.quiz.questions.find(q => q.id === qId);
    if (!question) return;

    const newAnswer: Answer = {
      id: generateId('a'),
      text: 'Neue Antwort',
      isCorrect: false
    };

    updateQuestion(qId, { answers: [...question.answers, newAnswer] });
  };

  const updateAnswer = (qId: string, aId: string, updates: Partial<Answer>) => {
    if (!lesson.quiz) return;
    const question = lesson.quiz.questions.find(q => q.id === qId);
    if (!question) return;

    const newAnswers = question.answers.map(a => a.id === aId ? { ...a, ...updates } : a);
    updateQuestion(qId, { answers: newAnswers });
  };

  const deleteAnswer = (qId: string, aId: string) => {
    if (!lesson.quiz) return;
    const question = lesson.quiz.questions.find(q => q.id === qId);
    if (!question) return;

    const newAnswers = question.answers.filter(a => a.id !== aId);
    updateQuestion(qId, { answers: newAnswers });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/course/${course.id}/module/${module.id}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Modul
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Lektion bearbeiten</h2>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
          <input
            type="text"
            value={lesson.title}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-awo-red"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
          <input
            type="text"
            value={lesson.description}
            onChange={(e) => handleUpdate({ description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-awo-red"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (relativ zu root, z.B. videos/demo.mp4)</label>
          <input
            type="text"
            value={lesson.videoUrl || ''}
            onChange={(e) => handleUpdate({ videoUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-awo-red"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inhalt (Text)</label>
          <textarea
            value={lesson.content || ''}
            onChange={(e) => handleUpdate({ content: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-awo-red"
          />
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Quiz</h3>
        <Button onClick={addQuestion} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Frage hinzufügen
        </Button>
      </div>

      {!lesson.quiz || lesson.quiz.questions.length === 0 ? (
        <p className="text-gray-500 italic">Kein Quiz oder keine Fragen vorhanden.</p>
      ) : (
        <div className="space-y-6">
            <Card className="p-4">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Benötigte Punktzahl zum Bestehen</label>
                 <input
                    type="number"
                    min="0"
                    value={lesson.quiz.passingScore}
                    onChange={(e) => updateQuiz({ passingScore: parseInt(e.target.value) || 0 })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                 />
            </Card>

            {lesson.quiz.questions.map((question, qIndex) => (
                <Card key={question.id} className="p-4 space-y-4 border-l-4 border-l-awo-red">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-bold text-gray-700">Frage {qIndex + 1}</label>
                            <input
                                type="text"
                                value={question.text}
                                onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Fragetext..."
                            />
                            <div className="flex items-center gap-4">
                                <label className="text-sm text-gray-600">Typ:</label>
                                <select
                                    value={question.type}
                                    onChange={(e) => updateQuestion(question.id, { type: e.target.value as QuestionType })}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                >
                                    <option value="single-choice">Single Choice</option>
                                    <option value="multiple-choice">Multiple Choice</option>
                                </select>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => deleteQuestion(question.id)} className="text-red-600 ml-4">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="pl-4 border-l-2 border-gray-100 space-y-2">
                        <div className="flex justify-between items-center">
                            <h5 className="text-sm font-semibold text-gray-600">Antworten</h5>
                            <Button size="sm" variant="outline" onClick={() => addAnswer(question.id)} className="text-xs">
                                <Plus className="w-3 h-3 mr-1" /> Antwort
                            </Button>
                        </div>

                        {question.answers.map((answer) => (
                            <div key={answer.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={answer.isCorrect}
                                    onChange={(e) => updateAnswer(question.id, answer.id, { isCorrect: e.target.checked })}
                                    className="h-4 w-4 text-awo-red focus:ring-awo-red border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    value={answer.text}
                                    onChange={(e) => updateAnswer(question.id, answer.id, { text: e.target.value })}
                                    className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                                    placeholder="Antwortmöglichkeit..."
                                />
                                <button onClick={() => deleteAnswer(question.id, answer.id)} className="text-gray-400 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
