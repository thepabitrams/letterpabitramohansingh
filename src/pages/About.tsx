// src/pages/About.tsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  FaArrowRight,
  FaCode,
  FaGithub,
  FaHeart,
  FaMagic,
  FaShareAlt,
} from 'react-icons/fa'
import { Footer, Header } from '../core/components/layout'
import { Container, LoginModal } from '../core/components/ui'
import { PageMeta } from '../core/seo/PageMeta'
import { buildAboutPageSchema } from '../core/seo/structured-data'
import {
  AUTHOR_NAME,
  PORTFOLIO_URL,
  SITE_NAME,
  SOCIALS,
} from '../core/seo/constants'
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

const HOW_IT_WORKS_STEPS = [
  {
    icon: FaMagic,
    title: 'Write',
    description:
      'Compose your message. Ask a question, add a note, or just say how you feel.',
  },
  {
    icon: FaHeart,
    title: 'Customize',
    description:
      'Pick the background, fonts, effects, and buttons. Make it feel like yours.',
  },
  {
    icon: FaShareAlt,
    title: 'Share',
    description:
      'Send the link. They read it, reply, and after a few days it disappears forever.',
  },
] as const

const TECH_STACK = [
  'React 19',
  'TypeScript',
  'Cloudflare Workers',
  'Cloudflare D1',
  'Tailwind CSS',
  'Hono',
] as const

export function About() {
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
        title="About"
        description={`${SITE_NAME} is a free, open-source tool for sending beautiful, self-destructing letters. Built by ${AUTHOR_NAME}.`}
        path="/about"
        structuredData={buildAboutPageSchema()}
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

        <main className="py-16 px-4">
          <Container className="space-y-20">
            <section className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Some things are worth saying once, then letting go.
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {SITE_NAME} lets you write a personal message, make it beautiful,
                and send it as a link that disappears after a few days. No feed.
                No likes. No permanence. Just a moment between two people.
              </p>
            </section>

            <section className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Why I built this
              </h2>
              <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Digital messages today feel disposable. We send hundreds a day,
                  and they pile up in inboxes nobody opens. The things that
                  matter get lost in the noise.
                </p>
                <p>
                  I wanted to build the opposite. A place where you write one
                  message that matters, send it to one person, and know it will
                  disappear. The impermanence is the point — it makes the
                  message feel precious.
                </p>
                <p>
                  {SITE_NAME} is free, open source, and has no ads, no tracking,
                  and no upsells. It exists because I wanted it to exist.
                </p>
              </div>
            </section>

            <section className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
                How it works
              </h2>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {HOW_IT_WORKS_STEPS.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div
                      key={step.title}
                      className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <FaCode
                  size={20}
                  className="text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Built with
                </h2>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {SITE_NAME} runs on modern, edge-first infrastructure. Pages
                render fast, data stays private, and the whole thing costs
                almost nothing to run.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {TECH_STACK.map((tech) => (
                  <li
                    key={tech}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </section>

            <section className="max-w-3xl mx-auto">
              <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Open source
                </h2>
                <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  The entire codebase is public. Read it, fork it, learn from it,
                  or run your own version. {SITE_NAME} will always be free and
                  always be open.
                </p>
                <a
                  href={SOCIALS.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                >
                  <FaGithub aria-hidden="true" />
                  View on GitHub
                </a>
              </div>
            </section>

            <section className="max-w-3xl mx-auto text-center">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Built by{' '}
                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition"
                >
                  {AUTHOR_NAME}
                </a>
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm rounded-xl border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium transition"
                >
                  Write your first letter
                  <FaArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </section>
          </Container>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default About