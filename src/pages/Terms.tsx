// src/pages/Terms.tsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa6'
import { Footer, Header } from '../core/components/layout'
import { LoginModal } from '../core/components/ui'
import { PageMeta } from '../core/seo/PageMeta'
import { AUTHOR_NAME, CONTACT_EMAIL, SITE_NAME } from '../core/seo/constants'
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

const LAST_UPDATED = 'October 14, 2026'

export function Terms() {
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
        title="Terms of Service"
        description={`The rules for using ${SITE_NAME}, a free tool for sending self-destructing letters.`}
        path="/terms"
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
                Terms of Service
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Last updated: {LAST_UPDATED}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                By using {SITE_NAME}, you agree to these terms. Please read them
                carefully. They are short and written in plain language.
              </p>
            </header>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                1. What {SITE_NAME} is
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  {SITE_NAME} is a free tool for writing and sending personal,
                  self-destructing letters over the web. You write a message,
                  customize how it looks, and share a link. After an expiry
                  period, the letter is removed from our servers.
                </p>
                <p>
                  {SITE_NAME} is operated by {AUTHOR_NAME} as a personal
                  project, not as a commercial service.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                2. Your account
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  To create a letter, you need to sign in with Google. You are
                  responsible for keeping your Google account secure. You must
                  be at least 13 years old to use {SITE_NAME}.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                3. Acceptable use
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>You agree not to use {SITE_NAME} to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Send threats, harassment, or abuse to anyone.</li>
                  <li>Share illegal content of any kind.</li>
                  <li>
                    Impersonate another person or misrepresent your identity.
                  </li>
                  <li>
                    Attempt to disrupt, overload, or reverse-engineer the
                    service.
                  </li>
                  <li>Use the service for spam or bulk unsolicited messages.</li>
                </ul>
                <p>
                  We reserve the right to remove any content and terminate any
                  account that violates these rules, without notice.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                4. Your content
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  You own the letters you write. By using {SITE_NAME}, you grant
                  us permission to store and display your letters so we can
                  deliver them to the person you sent them to. This permission
                  ends when the letter is deleted.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                5. Service availability
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  {SITE_NAME} is provided &ldquo;as is&rdquo; and &ldquo;as
                  available.&rdquo; We do not guarantee that the service will be
                  uninterrupted, error-free, or that letters will always be
                  delivered on time.
                </p>
                <p>
                  We may modify, suspend, or discontinue the service at any time
                  without notice.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                6. Limitation of liability
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  To the maximum extent permitted by law, {AUTHOR_NAME} is not
                  liable for any indirect, incidental, or consequential damages
                  arising from your use of {SITE_NAME}, including lost letters,
                  lost replies, or lost data.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                7. Termination
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  You can stop using {SITE_NAME} at any time. You can request
                  deletion of your account by emailing us. We may also terminate
                  or suspend your access if you violate these terms.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                8. Governing law
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  These terms are governed by the laws of India. Any disputes
                  will be handled in the courts of India.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                9. Changes to these terms
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  We may update these terms from time to time. When we do, we
                  will update the &ldquo;Last updated&rdquo; date at the top of
                  this page. Continued use of {SITE_NAME} after changes means
                  you accept the updated terms.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                10. Contact
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  For any questions about these terms, contact us at{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-gray-900 dark:text-gray-100 underline hover:no-underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            </section>

            <footer className="pt-10 border-t border-gray-200 dark:border-gray-800">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FaArrowLeft size={12} aria-hidden="true" />
                <span>Back to home</span>
              </Link>
            </footer>
          </article>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default Terms