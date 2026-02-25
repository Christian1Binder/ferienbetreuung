import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, ArrowLeft, Trash2, Edit } from 'lucide-react';

export function ModuleEditor() {
  const { courseId, moduleId } = useParams<{ courseId: string, moduleId: string }>();
  const navigate = useNavigate();
  const courses = useAppStore((state) => state.courses);
  const updateModule = useAppStore((state) => state.updateModule);
  const addLesson = useAppStore((state) => state.addLesson);
  const deleteLesson = useAppStore((state) => state.deleteLesson);

  const course = courses.find((c) => c.id === courseId);
  const module = course?.modules.find((m) => m.id === moduleId);

  if (!course || !module) {
    return <div className="p-8 text-center text-red-600">Modul nicht gefunden.</div>;
  }

  const handleAddLesson = () => {
    const newId = `lesson-${Date.now()}`;
    addLesson(course.id, module.id, {
      id: newId,
      title: 'Neue Lektion',
      description: '',
      content: '',
      videoUrl: '',
      order: module.lessons.length + 1,
      quiz: {
        id: `quiz-${newId}`,
        title: 'Quiz',
        questions: [],
        passingScore: 1
      }
    });
    // Optional: Navigate to lesson editor immediately
    // navigate(`/admin/course/${course.id}/module/${module.id}/lesson/${newId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/course/${course.id}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Kurs
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Modul bearbeiten</h2>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
          <input
            type="text"
            value={module.title}
            onChange={(e) => updateModule(course.id, module.id, { title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-awo-red"
          />
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Lektionen</h3>
        <Button onClick={handleAddLesson} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Lektion hinzufügen
        </Button>
      </div>

      <div className="space-y-4">
        {module.lessons.length === 0 ? (
          <p className="text-gray-500 italic">Noch keine Lektionen vorhanden.</p>
        ) : (
          module.lessons.map((lesson) => (
            <Card key={lesson.id} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                <p className="text-sm text-gray-500">{lesson.description || 'Keine Beschreibung'}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/course/${course.id}/module/${module.id}/lesson/${lesson.id}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Bearbeiten
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    if(confirm('Lektion löschen?')) deleteLesson(course.id, module.id, lesson.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
