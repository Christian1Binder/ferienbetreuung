import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Plus, Save } from 'lucide-react';
import type { Course, Module, Lesson } from '../../types';

export function AdminDashboard() {
  const courses = useAppStore((state) => state.courses);
  const updateCourse = useAppStore((state) => state.updateCourse);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Initialize with first course
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      // Defer to next tick to avoid synchronous update warning
      const timer = setTimeout(() => setSelectedCourse(courses[0]), 0);
      return () => clearTimeout(timer);
    }
  }, [courses, selectedCourse]);

  const handleSaveCourse = () => {
    if (selectedCourse) {
      updateCourse(selectedCourse);
      alert('Änderungen wurden im lokalen Speicher gesichert.');
    }
  };

  const updateCourseField = (field: keyof Course, value: unknown) => {
    if (!selectedCourse) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedCourse({ ...selectedCourse, [field]: value as any });
  };

  const addModule = () => {
    if (!selectedCourse) return;
    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: 'Neues Modul',
      lessons: []
    };
    setSelectedCourse({
      ...selectedCourse,
      modules: [...selectedCourse.modules, newModule]
    });
  };

  const updateModuleTitle = (moduleId: string, title: string) => {
    if (!selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      modules: selectedCourse.modules.map(m =>
        m.id === moduleId ? { ...m, title } : m
      )
    });
  };

  const addLesson = (moduleId: string) => {
    if (!selectedCourse) return;
    const newLesson: Lesson = {
      id: `less-${Date.now()}`,
      title: 'Neue Lektion',
      description: '',
      order: 99,
      videoUrl: '',
      content: ''
    };

    setSelectedCourse({
      ...selectedCourse,
      modules: selectedCourse.modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, lessons: [...m.lessons, newLesson] };
        }
        return m;
      })
    });
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: unknown) => {
    if (!selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      modules: selectedCourse.modules.map(m => {
        if (m.id === moduleId) {
          return {
             ...m,
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value as any } : l)
          };
        }
        return m;
      })
    });
  };

  if (!selectedCourse) return <div className="p-8">Lade Daten...</div>;

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kursverwaltung</h1>
          <p className="text-sm text-gray-500">Bearbeiten Sie hier die Kursinhalte.</p>
        </div>
        <Button onClick={handleSaveCourse} className="gap-2">
          <Save className="w-4 h-4" /> Änderungen speichern
        </Button>
      </div>

      <Card className="bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Kurs Details</h2>
        <div className="grid gap-4">
          <Input
            label="Titel"
            value={selectedCourse.title}
            onChange={(e) => updateCourseField('title', e.target.value)}
          />
          <div className="space-y-1">
             <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
             <textarea
               className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-awo-red focus:border-transparent outline-none"
               rows={3}
               value={selectedCourse.description}
               onChange={(e) => updateCourseField('description', e.target.value)}
             />
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <h2 className="text-xl font-bold text-gray-900">Module & Lektionen</h2>
           <Button variant="outline" onClick={addModule} size="sm" className="gap-1">
             <Plus className="w-4 h-4" /> Neues Modul
           </Button>
        </div>

        {selectedCourse.modules.map((module) => (
          <Card key={module.id} className="relative border-l-4 border-l-awo-red">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white pb-4 border-b border-gray-100">
              <div className="flex-1 w-full">
                <Input
                  label="Modul Titel"
                  value={module.title}
                  onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                  className="font-bold text-lg"
                />
              </div>
              <Button variant="secondary" size="sm" onClick={() => addLesson(module.id)} className="shrink-0 mt-6">
                <Plus className="w-4 h-4 mr-1" /> Lektion hinzufügen
              </Button>
            </div>

            <div className="space-y-4">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                   <div className="grid md:grid-cols-2 gap-4 mb-3">
                     <Input
                       label="Lektion Titel"
                       value={lesson.title}
                       onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                     />
                     <Input
                       label="Video URL (YouTube Embed Link)"
                       value={lesson.videoUrl || ''}
                       onChange={(e) => updateLesson(module.id, lesson.id, 'videoUrl', e.target.value)}
                       placeholder="https://www.youtube.com/embed/..."
                     />
                   </div>
                   <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
                     <textarea
                       className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-awo-red outline-none"
                       rows={2}
                       value={lesson.description}
                       onChange={(e) => updateLesson(module.id, lesson.id, 'description', e.target.value)}
                       placeholder="Kurze Beschreibung der Lektion..."
                     />
                   </div>

                   {/* Extendable for Quiz editing */}
                   <div className="mt-2 flex justify-end">
                      <span className="text-xs text-gray-400">Quiz ID: {lesson.quiz?.id || 'Kein Quiz'}</span>
                   </div>
                </div>
              ))}
              {module.lessons.length === 0 && (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  Keine Lektionen in diesem Modul
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
