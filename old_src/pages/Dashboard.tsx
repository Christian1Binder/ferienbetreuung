import { Link, Navigate } from 'react-router-dom';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const user = useAppStore((state) => state.user);
  const courses = useAppStore((state) => state.courses);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Hallo, {user.name}!</h1>
           <p className="text-gray-600">Willkommen zurück auf deiner Lernplattform.</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-500">Keine Kurse verfügbar.</p>
      ) : (
        <div className="space-y-12">
          {courses.map((course) => {
            const allLessons = course.modules.flatMap(m => m.lessons);
            const totalLessons = allLessons.length;
            const completedLessons = user.completedLessons.filter(id => allLessons.some(l => l.id === id)).length;
            const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

            return (
              <div key={course.id} className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="flex flex-col h-full border-t-4 border-t-awo-red hover:shadow-md transition-shadow">
                    <div className="mb-4">
                      <span className="text-xs font-bold tracking-wider text-awo-red uppercase">Kurs</span>
                      <h2 className="text-xl font-bold text-gray-900 mt-1">{course.title}</h2>
                      <p className="text-gray-600 mt-2 text-sm line-clamp-3">{course.description}</p>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Fortschritt</span>
                          <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
                        </div>
                        <ProgressBar progress={progress} />
                      </div>

                      <Link to={`/course/${course.id}`} className="block">
                        <Button className="w-full group gap-2">
                          {progress > 0 ? 'Weiterlernen' : 'Kurs starten'}
                          <PlayCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </Card>

                  <Card className="flex flex-col h-full">
                    <h3 className="font-bold text-gray-900 mb-4">Deine Übersicht</h3>
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{completedLessons} / {totalLessons}</p>
                          <p className="text-xs text-gray-600">Lektionen abgeschlossen</p>
                        </div>
                      </div>
                       <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{course.modules.length}</p>
                          <p className="text-xs text-gray-600">Module insgesamt</p>
                        </div>
                      </div>
                    </div>

                    {progress === 100 && (
                       <Link to="/certificate" className="mt-4 block">
                          <Button variant="outline" className="w-full">
                            Zertifikat ansehen
                          </Button>
                       </Link>
                    )}
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
