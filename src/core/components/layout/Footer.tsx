// src/core/components/layout/Footer.tsx
import { FaCoffee } from 'react-icons/fa'

interface FooterProps {
  actions?: React.ReactNode
}

export function Footer({ actions }: FooterProps): React.ReactElement {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        {actions && (
          <nav
            aria-label="Page actions"
            className="flex flex-wrap items-center justify-center gap-2 order-1 md:order-0"
          >
            {actions}
          </nav>
        )}

        <a
          href="https://buymeacoffee.com/pabitramohansingh"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Buy me a coffee (opens in new tab)"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFDD00] text-black text-sm font-semibold shadow-sm hover:bg-[#FFE733] hover:shadow-md transition-all whitespace-nowrap order-2 md:order-0"
        >
          <FaCoffee size={16} aria-hidden="true" />
          <span>Buy me a coffee</span>
        </a>

        <p className="text-xs text-gray-400 text-center md:text-right order-3 md:order-0">
          © {currentYear} Pabitra Mohan Singh
        </p>
      </div>
    </footer>
  )
}

export default Footer