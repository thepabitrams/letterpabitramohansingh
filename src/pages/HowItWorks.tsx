// src/pages/HowItWorks.tsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  FaArrowLeft,
  FaHeart,
  FaShareNodes,
  FaWandMagicSparkles,
} from 'react-icons/fa6'
import { Footer, Header } from '../core/components/layout'
import { LoginModal } from '../core/components/ui'
import { PageMeta } from '../core/seo/PageMeta'
import { SITE_NAME } from '../core/seo/constants'
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

const STEPS = [
  {
    icon: FaWandMagicSparkles,
    title: 'Write',
    description:
      'Compose your message. Ask a question, add a note, or just say how you feel. Choose from different patterns — Yes/No, single button, or a simple reply.',
  },
  {
    icon: FaHeart,
    title: 'Customize',
    description:
      'Pick the background, fonts, effects, and button style. Every letter can feel like its own small moment. Make it look the way you want it to feel.',
  },
  {
    icon: FaShareNodes,
    title: 'Share',
    description:
      'Generate a link and send it to the person you wrote it for. They read it, reply, and after a few days the letter disappears from the server.',
  },
] as const

export function HowItWorks() {
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
        title="How It Works"
        description={`Learn how ${SITE_NAME} works — write a personalized letter, customize it, and send it as a self-destructing link.`}
        path="/how-it-works"
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
                How it works
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Three steps. No sign-up forms to fill, no profiles to build, no
                feed to scroll. Just a message from you to someone else.
              </p>
            </header>

            <section className="space-y-10">
              {STEPS.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.title} className="flex gap-5">
                    <div className="shrink-0">
                      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Step {index + 1}
                      </p>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {step.title}
                      </h2>
                      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                What happens after
              </h2>
              <div className="space-y-5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Once someone replies, both of you can see what was said. From
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

            <footer className="pt-10 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FaArrowLeft size={12} aria-hidden="true" />
                  <span>Write a letter</span>
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <span>Still have questions? Contact me</span>
                </Link>
              </div>
            </footer>
          </article>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default HowItWorks