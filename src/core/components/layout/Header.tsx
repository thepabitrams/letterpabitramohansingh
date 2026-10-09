/* src/core/components/layout/Header.tsx */
type Props = {
  user: { name: string; image?: string } | null
  onLoginClick: () => void
  onLogout: () => void
}

export function Header({ user, onLoginClick, onLogout }: Props) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between relative">
        <div className="absolute left-1/2 -translate-x-1/2 text-gray-900 font-semibold hidden md:block">
          Letter By Pabitra Mohan Singh
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {user ? (
            <div className="flex items-center gap-3">
              {user.image && <img src={user.image} alt="" className="w-8 h-8 rounded-full" />}
              <span className="text-sm text-gray-700 hidden sm:inline">{user.name}</span>
              <button
                onClick={onLogout}
                className="text-xs text-gray-600 hover:text-gray-900 font-medium"
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
  )
}