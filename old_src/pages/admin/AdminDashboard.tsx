import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, Download, Edit, Trash2, FileJson } from 'lucide-react';

export function AdminDashboard() {
  const courses = useAppStore((state) => state.courses);
  const addCourse = useAppStore((state) => state.addCourse);
  const deleteCourse = useAppStore((state) => state.deleteCourse);
  const navigate = useNavigate();

  const handleAddCourse = () => {
    const newId = `course-${Date.now()}`;
    addCourse({
      id: newId,
      title: 'Neuer Kurs',
      description: 'Beschreibung hier eingeben...',
      modules: []
    });
    navigate(`/admin/course/${newId}`);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Möchten Sie diesen Kurs wirklich löschen?')) {
      deleteCourse(id);
    }
  };

  const handleExport = () => {
    const data = `window.coursesData = ${JSON.stringify(courses, null, 2)};`;
    const blob = new Blob([data], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'courses.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kursverwaltung</h2>
          <p className="text-gray-600">Verwalten Sie hier Ihre Kurse und Inhalte.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportieren
          </Button>
          <Button onClick={handleAddCourse} className="gap-2">
            <Plus className="w-4 h-4" />
            Neuer Kurs
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {courses.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Keine Kurse vorhanden.</p>
          </div>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{course.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileJson className="w-3 h-3" />
                    ID: {course.id}
                  </span>
                  <span>{course.modules.length} Module</span>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => navigate(`/admin/course/${course.id}`)}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Bearbeiten
                </Button>
                <Button
                  onClick={() => handleDeleteCourse(course.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none gap-2 text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Löschen
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
        <strong>Hinweis:</strong> Änderungen werden nur lokal gespeichert. Klicken Sie auf "Exportieren", um die Datei <code>courses.js</code> herunterzuladen und ersetzen Sie die Datei auf Ihrem Server.
      </div>
    </div>
  );
}
