// src/pages/Contact.tsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  FaArrowLeft,
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from 'react-icons/fa6'
import { Footer, Header } from '../core/components/layout'
import { LoginModal } from '../core/components/ui'
import { PageMeta } from '../core/seo/PageMeta'
import { CONTACT_EMAIL, SOCIALS } from '../core/seo/constants'
import { authClient } from '../core/lib/auth-client'
import { getMe } from '../core/lib/api'

interface User {
  id: string
  name: string
  email: string
  image?: string | undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeUser(value: unknown): User | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== 'string') return null
  if (typeof value.name !== 'string') return null
  if (typeof value.email !== 'string') return null

  return {
    id: value.id,
    name: value.name,
    email: value.email,
    image: typeof value.image === 'string' ? value.image : undefined,
  }
}

const CONTACT_CHANNELS = [
  {
    label: 'GitHub Issues',
    description: 'Fastest for bugs. Open an issue and I will see it.',
    href: `${SOCIALS.github}/letters/issues`,
    icon: FaGithub,
  },
  {
    label: 'Email',
    description: 'For anything else. I reply within a few days.',
    href: `mailto:${CONTACT_EMAIL}`,
    icon: FaEnvelope,
  },
  {
    label: 'X',
    description: 'Short messages, quick questions.',
    href: SOCIALS.twitter,
    icon: FaXTwitter,
  },
  {
    label: 'Instagram',
    description: 'Direct messages are open.',
    href: SOCIALS.instagram,
    icon: FaInstagram,
  },
  {
    label: 'LinkedIn',
    description: 'For work or collaboration.',
    href: SOCIALS.linkedin,
    icon: FaLinkedin,
  },
] as const

export function Contact() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    let isCancelled = false

    getMe()
      .then((userData) => {
        if (!isCancelled) setUser(normalizeUser(userData))
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [])

  const handleLogout = async (): Promise<void> => {
    await authClient.signOut()
    setUser(null)
  }

  return (
    <>
      <PageMeta
        title="Contact"
        description="Get in touch with the developer behind Letters. Report bugs, ask questions, or just say hi."
        path="/contact"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Header
          user={user}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
        />

        <LoginModal
          open={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />

        <main className="py-20 px-6">
          <article className="max-w-2xl mx-auto space-y-12">
            <header className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-[1.1] tracking-tight">
                Contact
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Letters is built and maintained by one person. If you have a
                question, found a bug, or just want to say hi, reach out on any
                of these.
              </p>
            </header>

            <section className="space-y-3">
              {CONTACT_CHANNELS.map((channel) => {
                const Icon = channel.icon
                return (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shrink-0">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {channel.label}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {channel.description}
                      </p>
                    </div>
                  </a>
                )
              })}
            </section>

            <footer className="pt-10 border-t border-gray-200 dark:border-gray-800">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FaArrowLeft size={12} aria-hidden="true" />
                <span>Write a letter</span>
              </Link>
            </footer>
          </article>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default Contact