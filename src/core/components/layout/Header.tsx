// src/core/components/layout/Header.tsx

import { Link, useLocation } from 'react-router'
import { ThemeToggle } from '../ui/ThemeToggle'

type HeaderProps = {
  user: { name: string; image?: string } | null
  onLoginClick: () => void
  onLogout: () => void
}

const NAV_LINKS = [
  { label: 'About', href: '/about', hideOnMobile: false },
  { label: 'How It Works', href: '/how-it-works', hideOnMobile: false },
  { label: 'Contact', href: '/contact', hideOnMobile: true },
  { label: 'Privacy', href: '/privacy', hideOnMobile: true },
  { label: 'Terms', href: '/terms', hideOnMobile: true },
] as const

export function Header({ user, onLoginClick, onLogout }: HeaderProps) {
  const { pathname } = useLocation()
  const isHomePage = pathname === '/'

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 sm:gap-10">
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0"
        >
          <img
            src="/icon/pabitra-avatar-black.svg"
            alt=""
            className="w-7 h-7 dark:hidden"
          />
          <img
            src="/icon/pabitra-avatar-white.svg"
            alt=""
            className="w-7 h-7 hidden dark:block"
          />
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            Letters
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          {!isHomePage && (
            <div className="flex items-center gap-4 sm:gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    link.hideOnMobile ? 'hidden md:inline-block' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div className="shrink-0">
            <ThemeToggle />
          </div>

          {isHomePage && (
            user ? (
              <div className="flex items-center gap-2 shrink-0">
                {user.image && (
                  <img
                    src={user.image}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition shrink-0"
              >
                Sign In
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  )
}