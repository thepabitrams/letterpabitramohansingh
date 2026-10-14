// src/core/components/layout/Footer.tsx

import { Link } from 'react-router'
import { FaCoffee } from 'react-icons/fa'
import {
  FaArrowUpRightFromSquare,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from 'react-icons/fa6'
import { AUTHOR_NAME, PORTFOLIO_URL, SOCIALS } from '../../seo/constants'

interface FooterProps {
  actions?: React.ReactNode
}

const PAGE_LINKS_COL_1 = [
  { label: 'About', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
] as const

const PAGE_LINKS_COL_2 = [
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
] as const

const PAGE_LINKS_COL_3 = [
  { label: 'Terms', href: '/terms' },
] as const

const SOCIAL_LINKS = [
  { label: 'GitHub', href: SOCIALS.github, icon: FaGithub },
  { label: 'LinkedIn', href: SOCIALS.linkedin, icon: FaLinkedin },
  { label: 'X', href: SOCIALS.twitter, icon: FaXTwitter },
  { label: 'Instagram', href: SOCIALS.instagram, icon: FaInstagram },
] as const

export function Footer({ actions }: FooterProps): React.ReactElement {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
      {actions ? (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="flex items-center justify-center md:justify-end gap-2 flex-wrap">
            {actions}
          </div>
        </div>
      ) : null}

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 items-start">
          <div className="flex flex-col items-center md:items-start gap-5">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Get to Know Letters
            </h3>

            <div className="grid grid-cols-3 gap-x-8 gap-y-3">
              <ul className="flex flex-col gap-3">
                {PAGE_LINKS_COL_1.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="flex flex-col gap-3">
                {PAGE_LINKS_COL_2.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="flex flex-col gap-3">
                {PAGE_LINKS_COL_3.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://buymeacoffee.com/pabitramohansingh"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Buy me a coffee (opens in new tab)"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFDD00] text-black text-sm font-semibold shadow-sm hover:bg-[#FFE733] hover:shadow-md transition-all whitespace-nowrap"
            >
              <FaCoffee size={16} aria-hidden="true" />
              <span>Buy me a coffee</span>
            </a>
          </div>

          <div className="flex flex-row items-center justify-center md:justify-end gap-10 sm:gap-8 md:gap-10">
            <img
              src="/icon/pabitra-avatar-suit-black.svg"
              alt="Pabitra Mohan Singh"
              className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 dark:hidden"
            />
            <img
              src="/icon/pabitra-avatar-suit-white.svg"
              alt="Pabitra Mohan Singh"
              className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 hidden dark:block"
            />

            <div className="flex flex-col items-start gap-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Connect with me
              </h3>

              <div className="flex items-center gap-5">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    title={label}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <Icon size={28} aria-hidden="true" />
                  </a>
                ))}
              </div>

              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${AUTHOR_NAME} portfolio (opens in new tab)`}
                className="inline-flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:underline whitespace-nowrap"
              >
                <span>{AUTHOR_NAME}</span>
                <FaArrowUpRightFromSquare
                  size={12}
                  className="text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-6">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          © {currentYear} Pabitra Mohan Singh
        </p>
      </div>
    </footer>
  )
}

export default Footer