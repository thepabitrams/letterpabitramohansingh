// src/pages/About.tsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  FaArrowLeft,
  FaArrowUpRightFromSquare,
  FaGithub,
} from 'react-icons/fa6'
import { Footer, Header } from '../core/components/layout'
import { LoginModal } from '../core/components/ui'
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

        <main className="py-20 px-6">
          <article className="max-w-2xl mx-auto space-y-14">
            <header className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-[1.1] tracking-tight">
                Some things are worth saying once, then letting go.
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {SITE_NAME} is a small place on the internet where you can write
                one message to one person, make it beautiful, send it as a link,
                and watch it disappear after a few days.
              </p>
            </header>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Why I built this
              </h2>
              <div className="space-y-5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Digital messages today feel disposable. We send hundreds of
                  them a day, and they pile up in inboxes nobody opens. The
                  things that actually matter get lost in the noise.
                </p>
                <p>
                  I wanted to build the opposite. A place where you write one
                  message that matters, send it to one person, and know it will
                  disappear. The impermanence is the point. It makes you slow
                  down and think about what you actually want to say.
                </p>
                <p>
                  {SITE_NAME} has no feed, no likes, no notifications, no
                  tracking, no ads, and no upsells. It exists because I wanted
                  it to exist, and I think other people might want it too.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Keep it or let it go
              </h2>
              <div className="space-y-5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  When someone replies, both of you can see what was said. From
                  there, you each have the same choice: save it as an image or
                  as a standalone HTML file, or let it stay where it is.
                </p>
                <p>
                  Either way, the letter and the reply are removed from the
                  server after the expiry period. What you save on your device
                  is yours. What you don't save, disappears.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Free and open source
              </h2>
              <div className="space-y-5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  The entire codebase is public. Read it, fork it, learn from
                  it, or run your own version. {SITE_NAME} will always be free
                  and always be open.
                </p>
              </div>
              <a
                href={SOCIALS.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <FaGithub size={16} aria-hidden="true" />
                View the source on GitHub
              </a>
            </section>

            <footer className="pt-10 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FaArrowLeft size={12} aria-hidden="true" />
                  <span>Write a letter</span>
                </Link>

                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Built by{' '}
                  <a
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-baseline gap-1.5 font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <span>{AUTHOR_NAME}</span>
                    <FaArrowUpRightFromSquare
                      size={10}
                      className="text-gray-400 dark:text-gray-500"
                      aria-hidden="true"
                    />
                  </a>
                </p>
              </div>
            </footer>
          </article>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default About