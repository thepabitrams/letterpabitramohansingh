// src/core/components/layout/Header.tsx
import { ThemeToggle } from '../ui/ThemeToggle';

type HeaderProps = {
  user: { name: string; image?: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
};

export function Header({ user, onLoginClick, onLogout }: HeaderProps) {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between relative">
        <div className="absolute left-1/2 -translate-x-1/2 text-gray-900 dark:text-white font-semibold hidden md:block">
          Letters By Pabitra Mohan Singh
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              {user.image && (
                <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}