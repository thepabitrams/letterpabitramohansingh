// src/pages/Privacy.tsx

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

export function Privacy() {
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
        title="Privacy Policy"
        description={`How ${SITE_NAME} collects, uses, and protects your information.`}
        path="/privacy"
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
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Last updated: {LAST_UPDATED}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {SITE_NAME} is a small, personal project. This page explains
                what data we collect, why we collect it, and what rights you
                have over it.
              </p>
            </header>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                1. Information we collect
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    Account information.
                  </strong>{' '}
                  When you sign in with Google, we receive your name, email
                  address, and profile picture URL. We store this to identify
                  your account and show your name on letters you write.
                </p>
                <p>
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    Letter content.
                  </strong>{' '}
                  When you create a letter, we store the sender name, recipient
                  name, message, selected pattern, and customization settings
                  so we can display the letter to your recipient.
                </p>
                <p>
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    Replies and notes.
                  </strong>{' '}
                  When a recipient responds, we store their reply and any note
                  they add, so the sender can see the response.
                </p>
                <p>
                  We do not collect analytics, tracking data, or advertising
                  identifiers. We do not use cookies beyond those required for
                  authentication.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                2. How we use your information
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>We use the information we collect only to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Authenticate your account and keep you signed in.</li>
                  <li>Deliver letters between senders and recipients.</li>
                  <li>Display replies and notes to the appropriate person.</li>
                  <li>Respond to your support requests.</li>
                </ul>
                <p>
                  We never sell your data. We never share it with advertisers.
                  We never use it for any purpose other than running the
                  service.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                3. Data retention
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Letters and their replies are automatically deleted from our
                  servers after their expiry period. By default, this is seven
                  days from the time of creation.
                </p>
                <p>
                  Account information (name, email, profile picture) is kept
                  until you ask us to delete your account. You can request
                  deletion at any time by emailing us.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                4. Third-party services
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  {SITE_NAME} relies on the following third-party services to
                  operate:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Google
                    </strong>{' '}
                    — for sign-in. Your use of Google is governed by Google&apos;s
                    Privacy Policy.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Cloudflare
                    </strong>{' '}
                    — for hosting and database storage. Data is processed on
                    Cloudflare&apos;s infrastructure.
                  </li>
                </ul>
                <p>
                  We do not use any other third-party services for tracking,
                  analytics, or advertising.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                5. Your rights
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Access the personal information we hold about you.</li>
                  <li>Request correction of inaccurate information.</li>
                  <li>Request deletion of your account and data.</li>
                  <li>Withdraw consent for data processing at any time.</li>
                </ul>
                <p>
                  To exercise any of these rights, contact us at{' '}
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

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                6. Children&apos;s privacy
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  {SITE_NAME} is not intended for children under the age of 13.
                  We do not knowingly collect personal information from
                  children. If you believe a child has provided us with
                  personal information, please contact us so we can delete it.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                7. Changes to this policy
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. When we
                  do, we will update the &ldquo;Last updated&rdquo; date at the
                  top of this page. Continued use of {SITE_NAME} after changes
                  means you accept the updated policy.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                8. Contact
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  {SITE_NAME} is operated by {AUTHOR_NAME} from India. For any
                  questions about this Privacy Policy or how we handle your
                  data, contact us at{' '}
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

export default Privacy