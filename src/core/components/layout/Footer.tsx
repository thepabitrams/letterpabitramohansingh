/* src/core/components/layout/Footer.tsx */
import { FaCoffee, FaGithub } from 'react-icons/fa'

type FooterProps = {
  actions?: React.ReactNode
}

export function Footer({ actions }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <a
            href="https://buymeacoffee.com/pabitramohansingh"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <FaCoffee />
            Buy me a coffee
          </a>
          <a
            href="https://github.com/thepabitrams"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <FaGithub />
            GitHub
          </a>
        </div>

        <div className="flex items-center gap-4">
          {actions}
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Pabitra Mohan Singh
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer