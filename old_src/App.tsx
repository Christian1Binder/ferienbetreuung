import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { Layout } from './components/layout/Layout';
import { Welcome } from './pages/Welcome';
import { Dashboard } from './pages/Dashboard';
import { CourseView } from './pages/CourseView';
import { LessonView } from './pages/LessonView';
import { Certificate } from './pages/Certificate';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CourseEditor } from './pages/admin/CourseEditor';
import { ModuleEditor } from './pages/admin/ModuleEditor';
import { LessonEditor } from './pages/admin/LessonEditor';

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

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="course/:courseId" element={<CourseEditor />} />
          <Route path="course/:courseId/module/:moduleId" element={<ModuleEditor />} />
          <Route path="course/:courseId/module/:moduleId/lesson/:lessonId" element={<LessonEditor />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
