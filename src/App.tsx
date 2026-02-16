import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { Layout } from './components/layout/Layout';
import { Welcome } from './pages/Welcome';
import { Dashboard } from './pages/Dashboard';
import { CourseView } from './pages/CourseView';
import { LessonView } from './pages/LessonView';
import { Certificate } from './pages/Certificate';

function App() {
  const fetchCourses = useAppStore((state) => state.fetchCourses);
  const errorCourses = useAppStore((state) => state.errorCourses);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (errorCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center border-l-4 border-red-500 max-w-lg">
           <h2 className="text-xl font-bold text-red-600 mb-2">Konfigurationsfehler</h2>
           <p className="text-gray-700">{errorCourses}</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course/:courseId" element={<CourseView />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
          <Route path="/certificate" element={<Certificate />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
