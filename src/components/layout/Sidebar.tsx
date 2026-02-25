import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, GraduationCap, LogOut, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/useAppStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const logout = useAppStore((state) => state.logout);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Meine Kurse', icon: BookOpen, path: '/course/ferienbetreuung' },
    { label: 'Zertifikate', icon: GraduationCap, path: '/certificate' },
  ];

  const isActive = (path: string) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:transform-none lg:static flex flex-col h-full",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between lg:hidden">
           <span className="font-bold text-lg text-awo-gray">Menü</span>
           <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900">
             <X className="w-5 h-5" />
           </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-red-50 text-awo-red"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={clsx("w-5 h-5", active ? "text-awo-red" : "text-gray-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
           <button
             onClick={() => {
               logout();
               window.location.href = '/';
             }}
             className="group flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-awo-red transition-colors"
           >
             <LogOut className="w-5 h-5 text-gray-400 group-hover:text-awo-red" />
             Abmelden
           </button>

           <div className="mt-2 pt-2 border-t border-gray-100 text-center">
             <Link to="/admin/login" className="text-xs text-gray-400 hover:text-gray-600">
               Admin Login
             </Link>
           </div>
        </div>
      </aside>
    </>
  );
}
