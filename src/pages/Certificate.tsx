import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { generateCertificate } from '../utils/generateCertificate';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Download, Award, Lock } from 'lucide-react';

export function Certificate() {
  const user = useAppStore((state) => state.user);
  const courses = useAppStore((state) => state.courses);

  if (!user) return <Navigate to="/" replace />;

  const course = courses[0];
  const allLessons = course.modules.flatMap(m => m.lessons);
  const totalLessons = allLessons.length;
  const completedCount = user.completedLessons.filter(id => allLessons.some(l => l.id === id)).length;
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const isCompleted = Math.round(progress) === 100;

  if (!isCompleted) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
           <Lock className="w-12 h-12" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Zertifikat noch gesperrt</h1>

        <Card className="p-6">
          <p className="text-gray-600 mb-6">
            Du hast den Kurs "{course.title}" noch nicht vollständig abgeschlossen.<br/>
            Bitte absolviere alle {totalLessons} Lektionen.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Dein Fortschritt</span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
               <div className="bg-awo-red h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Noch {totalLessons - completedCount} Lektionen offen.
          </p>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    generateCertificate(
      user.name,
      course.title,
      new Date().toLocaleDateString('de-DE')
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="p-12 text-center border-2 border-awo-red relative overflow-hidden bg-white shadow-xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 transform rotate-12 translate-x-10 -translate-y-10">
          <Award className="w-64 h-64 text-awo-red" />
        </div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-awo-red mb-6">
            <Award className="w-12 h-12" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Herzlichen Glückwunsch!</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
            Du hast den Kurs <span className="font-bold text-gray-900">"{course.title}"</span> erfolgreich abgeschlossen.
          </p>

          <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-1">Ausgestellt für</p>
            <p className="text-2xl font-bold text-gray-900 mb-4">{user.name}</p>

            <p className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-1">Datum</p>
            <p className="text-lg text-gray-900 font-medium">{new Date().toLocaleDateString('de-DE')}</p>
          </div>

          <Button onClick={handleDownload} size="lg" className="gap-2 shadow-lg shadow-red-100">
            <Download className="w-5 h-5" />
            Zertifikat herunterladen (PDF)
          </Button>
        </div>
      </Card>
    </div>
  );
}
