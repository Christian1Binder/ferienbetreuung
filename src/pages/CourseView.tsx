import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle, PlayCircle, Lock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';

export function CourseView() {
  const { courseId } = useParams();
  const user = useAppStore((state) => state.user);
  const courses = useAppStore((state) => state.courses);

  const course = courses.find(c => c.id === courseId);

  if (!user) return <Navigate to="/" replace />;
  if (!course) return <div className="p-4">Kurs nicht gefunden</div>;

  const allLessons = course.modules.flatMap(m => m.lessons);
  const completedLessons = user.completedLessons;

  // Calculate progress
  const completedCount = completedLessons.filter(id => allLessons.some(l => l.id === id)).length;
  const progress = (completedCount / allLessons.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-awo-red mb-2 block">&larr; Zurück zum Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
        <div className="mt-4 max-w-xl">
           <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Gesamtfortschritt</span>
              <span className="font-medium">{Math.round(progress)}%</span>
           </div>
           <ProgressBar progress={progress} />
        </div>
      </div>

      <div className="space-y-6">
        {course.modules.map((module) => (
          <Card key={module.id} className="p-0 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{module.title}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {module.lessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);

                // Unlock logic:
                // Flatten all lessons, find index. Lesson is locked if index > 0 and previous lesson not completed.
                const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
                const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
                const isLocked = prevLesson ? !completedLessons.includes(prevLesson.id) : false;

                return (
                  <Link
                    key={lesson.id}
                    to={isLocked ? '#' : `/course/${course.id}/lesson/${lesson.id}`}
                    className={`flex items-center justify-between p-4 transition-colors ${
                      isLocked ? 'cursor-not-allowed opacity-50 bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={(e) => isLocked && e.preventDefault()}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? 'bg-green-100 text-green-600' :
                        isLocked ? 'bg-gray-200 text-gray-400' : 'bg-red-50 text-awo-red'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                         isLocked ? <Lock className="w-4 h-4" /> : <PlayCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                      </div>
                    </div>
                    {isCompleted && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded hidden sm:inline-block">Abgeschlossen</span>}
                  </Link>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
