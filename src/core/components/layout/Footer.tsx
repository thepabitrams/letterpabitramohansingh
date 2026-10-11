// src/core/components/layout/Footer.tsx
import { FaCoffee } from 'react-icons/fa'

interface FooterProps {
  actions?: React.ReactNode
}

export function Footer({ actions }: FooterProps): React.ReactElement {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <a
          href="https://buymeacoffee.com/pabitramohansingh"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Buy me a coffee (opens in new tab)"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFDD00] text-black text-sm font-semibold shadow-sm hover:bg-[#FFE733] hover:shadow-md transition-all"
        >
          <FaCoffee size={16} aria-hidden="true" />
          <span>Buy me a coffee</span>
        </a>

        <div className="flex items-center gap-4">
          {actions && (
            <>
              <nav
                aria-label="Page actions"
                className="flex items-center gap-2"
              >
                {actions}
              </nav>
              <div className="w-px h-5 bg-gray-200" aria-hidden="true" />
            </>
          )}

          <p className="text-xs text-gray-400">
            © {currentYear} Pabitra Mohan Singh
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer