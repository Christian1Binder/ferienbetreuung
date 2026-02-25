import { useState } from 'react';
import type { Quiz as QuizType } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface QuizProps {
  quiz: QuizType;
  onComplete: (score: number, passed: boolean) => void;
  onCancel: () => void;
}

export function Quiz({ quiz, onComplete, onCancel }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({}); // questionId -> answerIds
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (questionId: string, answerId: string, type: 'single-choice' | 'multiple-choice') => {
    setSelectedAnswers(prev => {
      const current = prev[questionId] || [];
      if (type === 'single-choice') {
        return { ...prev, [questionId]: [answerId] };
      } else {
        // Toggle
        if (current.includes(answerId)) {
          return { ...prev, [questionId]: current.filter(id => id !== answerId) };
        } else {
          return { ...prev, [questionId]: [...current, answerId] };
        }
      }
    });
  };

  const calculateResult = () => {
    let correctCount = 0;

    quiz.questions.forEach(q => {
      const selected = selectedAnswers[q.id] || [];
      const correctAnswers = q.answers.filter(a => a.isCorrect).map(a => a.id);

      const isCorrect = selected.length === correctAnswers.length &&
        selected.every(id => correctAnswers.includes(id));

      if (isCorrect) correctCount++;
    });

    setScore(correctCount);
    const isPassed = correctCount >= quiz.passingScore;
    setPassed(isPassed);
    setShowResult(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateResult();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  if (showResult) {
    return (
      <Card className="w-full max-w-lg mx-auto text-center p-8">
        <div className="mb-6 flex justify-center">
          {passed ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {passed ? 'Herzlichen Glückwunsch!' : 'Leider nicht bestanden'}
        </h2>

        <p className="text-gray-600 mb-6">
          Du hast {score} von {quiz.questions.length} Fragen richtig beantwortet.<br/>
          Benötigt werden {quiz.passingScore}.
        </p>

        <div className="flex gap-4 justify-center">
          {!passed && (
            <Button onClick={() => {
              setShowResult(false);
              setCurrentQuestionIndex(0);
              setSelectedAnswers({});
            }} variant="outline">
              Wiederholen
            </Button>
          )}
          <Button onClick={() => onComplete(score, passed)}>
            {passed ? 'Weiter' : 'Schließen'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
        <span className="text-sm text-gray-500">Frage {currentQuestionIndex + 1} von {quiz.questions.length}</span>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.text}</h3>
        <div className="space-y-3">
          {currentQuestion.answers.map(answer => {
            const isSelected = (selectedAnswers[currentQuestion.id] || []).includes(answer.id);
            return (
              <div
                key={answer.id}
                onClick={() => handleAnswerSelect(currentQuestion.id, answer.id, currentQuestion.type)}
                className={clsx(
                  "p-4 rounded-lg border cursor-pointer transition-colors flex items-center gap-3",
                  isSelected ? "border-awo-red bg-red-50" : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <div className={clsx(
                  "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0",
                  isSelected ? "border-awo-red bg-awo-red" : "border-gray-300"
                )}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className={clsx("text-sm", isSelected ? "text-gray-900 font-medium" : "text-gray-700")}>
                  {answer.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
        <Button
          onClick={handleNext}
          disabled={!(selectedAnswers[currentQuestion.id] && selectedAnswers[currentQuestion.id].length > 0)}
        >
          {isLastQuestion ? 'Abschließen' : 'Nächste Frage'}
        </Button>
      </div>
    </Card>
  );
}
