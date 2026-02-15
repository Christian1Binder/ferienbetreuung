import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Welcome } from './pages/Welcome';
import { Dashboard } from './pages/Dashboard';
import { CourseView } from './pages/CourseView';
import { LessonView } from './pages/LessonView';
import { Certificate } from './pages/Certificate';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
