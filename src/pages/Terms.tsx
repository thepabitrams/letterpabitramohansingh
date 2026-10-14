// src/pages/Terms.tsx

import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { Footer, Header } from '../core/components/layout'
import { PageMeta } from '../core/seo/PageMeta'
import {
  AUTHOR_NAME,
  CONTACT_EMAIL,
  PORTFOLIO_URL,
  SITE_NAME,
  SITE_URL,
} from '../core/seo/constants'

const LAST_UPDATED = 'October 14, 2026'

const termsPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `Terms of Service — ${SITE_NAME}`,
  url: `${SITE_URL}/terms`,
  description: `The rules for using ${SITE_NAME}, a free tool for sending self-destructing letters.`,
  publisher: {
    '@type': 'Person',
    name: AUTHOR_NAME,
  },
}

export function Terms() {
  return (
    <>
      <PageMeta
        title="Terms of Service"
        description={`The rules for using ${SITE_NAME}, a free tool for sending self-destructing letters.`}
        path="/terms"
        structuredData={termsPageSchema}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Header
          user={null}
          onLoginClick={() => {}}
          onLogout={() => {}}
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
                  period, the letter is removed from the servers.
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
                  <li>Send threats, harassment, or abuse to anyone</li>
                  <li>Share illegal content of any kind</li>
                  <li>
                    Impersonate another person or misrepresent your identity
                  </li>
                  <li>
                    Attempt to disrupt, overload, or reverse-engineer the
                    service
                  </li>
                  <li>Use the service for spam or bulk unsolicited messages</li>
                </ul>
                <p>
                  I reserve the right to remove any content and terminate any
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
                  me permission to store and display your letters so I can
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
                  available.&rdquo; I do not guarantee that the service will be
                  uninterrupted, error-free, or that letters will always be
                  delivered on time.
                </p>
                <p>
                  I may modify, suspend, or discontinue the service at any time
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
                  deletion of your account by emailing me. I may also terminate
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
                  I may update these terms from time to time. When I do, I will
                  update the &ldquo;Last updated&rdquo; date at the top of this
                  page. Continued use of {SITE_NAME} after changes means you
                  accept the updated terms.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                10. Contact
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  For any questions about these terms, contact me at{' '}
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
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-base">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <span>Letters</span>
                  <FaArrowUpRightFromSquare
                    size={12}
                    className="text-gray-400 dark:text-gray-500"
                    aria-hidden="true"
                  />
                </a>

                <span className="text-gray-400 dark:text-gray-500">·</span>

                <span className="text-gray-500 dark:text-gray-500">
                  Built by
                </span>

                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <span>{AUTHOR_NAME}</span>
                  <FaArrowUpRightFromSquare
                    size={12}
                    className="text-gray-400 dark:text-gray-500"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </footer>
          </article>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default Terms