import { User, Menu } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const user = useAppStore((state) => state.user);

  return (
    <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label="Menü öffnen"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          {/* AWO Logo approximation */}
          <div className="w-8 h-8 bg-awo-red rounded flex items-center justify-center text-white font-bold tracking-tighter">AWO</div>
          <span className="font-bold text-lg text-awo-gray hidden sm:inline-block">Bezirksjugendwerk</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">{user.name}</span>
            {user.facility && <span className="text-xs text-gray-500">{user.facility}</span>}
          </div>
        )}
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-awo-red">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}
