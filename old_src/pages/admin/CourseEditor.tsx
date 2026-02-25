import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, ArrowLeft, Trash2, Edit } from 'lucide-react';

export function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const courses = useAppStore((state) => state.courses);
  const updateCourse = useAppStore((state) => state.updateCourse);
  const addModule = useAppStore((state) => state.addModule);
  const deleteModule = useAppStore((state) => state.deleteModule);

  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return <div className="p-8 text-center text-red-600">Kurs nicht gefunden.</div>;
  }

  const handleAddModule = () => {
    const newId = `module-${Date.now()}`;
    addModule(course.id, {
      id: newId,
      title: 'Neues Modul',
      lessons: []
    });
    // Optional: Navigate to module editor immediately
    // navigate(`/admin/course/${course.id}/module/${newId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Kurs bearbeiten</h2>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => updateCourse(course.id, { title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-awo-red"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
          <textarea
            value={course.description}
            onChange={(e) => updateCourse(course.id, { description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-awo-red"
          />
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Module</h3>
        <Button onClick={handleAddModule} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Modul hinzufügen
        </Button>
      </div>

      <div className="space-y-4">
        {course.modules.length === 0 ? (
          <p className="text-gray-500 italic">Noch keine Module vorhanden.</p>
        ) : (
          course.modules.map((module) => (
            <Card key={module.id} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{module.title}</h4>
                <p className="text-sm text-gray-500">{module.lessons.length} Lektionen</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/course/${course.id}/module/${module.id}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Bearbeiten
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    if(confirm('Modul löschen?')) deleteModule(course.id, module.id);
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
