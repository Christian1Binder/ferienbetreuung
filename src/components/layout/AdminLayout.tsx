import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { LogOut, Home } from 'lucide-react';

export function AdminLayout() {
  const isAdmin = useAppStore((state) => state.isAdmin);
  const logoutAdmin = useAppStore((state) => state.logoutAdmin);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Bereich</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Zurück zur Seite</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
              onClick={logoutAdmin}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Abmelden</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
