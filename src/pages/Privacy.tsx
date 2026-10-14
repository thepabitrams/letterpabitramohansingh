// src/pages/Privacy.tsx

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

const privacyPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `Privacy Policy — ${SITE_NAME}`,
  url: `${SITE_URL}/privacy`,
  description: `How ${SITE_NAME} collects, uses, and protects your information.`,
  publisher: {
    '@type': 'Person',
    name: AUTHOR_NAME,
  },
}

export function Privacy() {
  return (
    <>
      <PageMeta
        title="Privacy Policy"
        description={`How ${SITE_NAME} collects, uses, and protects your information.`}
        path="/privacy"
        structuredData={privacyPageSchema}
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
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Last updated: {LAST_UPDATED}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                This Privacy Policy explains how {SITE_NAME} collects, uses, and
                protects your information when you use the service. It also
                describes your rights over your data and how to exercise them.
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {SITE_NAME} is operated by {AUTHOR_NAME} from India. By using
                the service, you agree to the practices described in this
                policy.
              </p>
            </header>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                1. Who I am
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  {SITE_NAME} is a free, open-source tool for sending
                  self-destructing letters over the web. The service is built
                  and maintained by {AUTHOR_NAME}, an individual developer based
                  in India.
                </p>
                <p>
                  For the purposes of the EU General Data Protection Regulation
                  (GDPR) and India&apos;s Digital Personal Data Protection Act,
                  2023 (DPDP Act), {AUTHOR_NAME} is the data controller (Data
                  Fiduciary) responsible for the personal data collected through
                  the service.
                </p>
                <p>
                  You can contact me at{' '}
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
                2. Information I collect
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  I collect only the minimum information needed to operate the
                  service.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pt-2">
                  Information you provide through Google Sign-In
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Your name (as provided by Google)</li>
                  <li>Your email address</li>
                  <li>Your profile picture URL (if available)</li>
                </ul>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  This information is used solely to identify your account and
                  display your name on letters you create.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pt-2">
                  Content you create
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Sender name and recipient name</li>
                  <li>The message content of your letter</li>
                  <li>The selected pattern (Yes/No, one choice, or note only)</li>
                  <li>Customization settings (background, fonts, effects)</li>
                  <li>Recipient replies and notes, if any</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pt-2">
                  Information collected automatically
                </h3>
                <p>
                  When you sign in, the authentication system stores your IP
                  address and browser user agent string alongside your session
                  record. This is standard practice for session security and is
                  used solely to detect suspicious sign-ins and protect your
                  account. It is not used for analytics, advertising, or
                  tracking.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pt-2">
                  Information I do not collect
                </h3>
                <p>
                  I do not collect analytics data, advertising identifiers,
                  cross-site tracking data, or browsing history. I do not use
                  cookies beyond those required to keep you signed in.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                3. How I use your information
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>I use the information I collect only to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Authenticate your account and keep you signed in</li>
                  <li>Deliver letters between senders and recipients</li>
                  <li>Display replies and notes to the appropriate person</li>
                  <li>Protect your account from unauthorized access</li>
                  <li>Respond to your support requests</li>
                </ul>
                <p>
                  I never sell your data. I never share it with advertisers. I
                  never use it for any purpose other than operating the service.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                4. Legal basis for processing
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Under the GDPR, I process your personal data on the following
                  legal bases:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Consent
                    </strong>{' '}
                    — you give me permission to access your Google account
                    information when you sign in. You can withdraw this consent
                    at any time by requesting account deletion.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Contractual necessity
                    </strong>{' '}
                    — processing is necessary to provide the service you
                    requested (delivering letters between users).
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Legitimate interest
                    </strong>{' '}
                    — I process minimal data to prevent abuse and maintain
                    service security.
                  </li>
                </ul>
                <p>
                  Under India&apos;s DPDP Act, consent is the primary basis for
                  processing personal data. You provide consent when you sign in
                  with Google and use the service.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                5. Data retention
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    Letters and replies
                  </strong>{' '}
                  are automatically deleted from the servers after their expiry
                  period. By default, this is seven (7) days from the time of
                  creation.
                </p>
                <p>
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    Account information
                  </strong>{' '}
                  (name, email, profile picture) is retained until you request
                  deletion of your account. You can request deletion at any time
                  by emailing me.
                </p>
                <p>
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    Session records
                  </strong>{' '}
                  (including IP address and user agent) are deleted when your
                  session expires or when you sign out. Active sessions are also
                  removed when your account is deleted.
                </p>
                <p>
                  When you request account deletion, I will delete your account
                  information within 30 days, except where required by law to
                  retain certain data.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                6. Third-party services
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
                    — for authentication. When you sign in, Google shares your
                    name, email, and profile picture with me. Your use of Google
                    is governed by Google&apos;s Privacy Policy and the Google
                    API Services User Data Policy.
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Cloudflare
                    </strong>{' '}
                    — for hosting and database storage. Data is processed on
                    Cloudflare&apos;s infrastructure. Cloudflare is a data
                    processor under contract with me and does not have
                    independent access to your data.
                  </li>
                </ul>
                <p>
                  I do not use any other third-party services for tracking,
                  analytics, or advertising. I do not share your data with any
                  other third party except as required by law.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                7. International data transfers
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Your data may be stored and processed on servers located
                  outside your country of residence, including servers operated
                  by Cloudflare. When I transfer personal data outside the
                  EU/EEA, I rely on appropriate safeguards such as Standard
                  Contractual Clauses (SCCs) or equivalent mechanisms.
                </p>
                <p>
                  Under India&apos;s DPDP Act, data transfers are permitted
                  unless the government restricts transfers to specific
                  countries by notification. I comply with all applicable
                  restrictions.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                8. Your rights
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>Depending on your location, you have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Access
                    </strong>{' '}
                    — request a copy of the personal data I hold about you
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Correction
                    </strong>{' '}
                    — request correction of inaccurate or incomplete data
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Deletion
                    </strong>{' '}
                    — request deletion of your account and personal data
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Withdrawal of consent
                    </strong>{' '}
                    — withdraw your consent to data processing at any time
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Objection
                    </strong>{' '}
                    — object to processing based on legitimate interests
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Portability
                    </strong>{' '}
                    — request your data in a structured, commonly used format
                    (GDPR only)
                  </li>
                  <li>
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      Non-discrimination
                    </strong>{' '}
                    — you will not be discriminated against for exercising your
                    rights (CCPA only)
                  </li>
                </ul>
                <p>
                  To exercise any of these rights, contact me at{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-gray-900 dark:text-gray-100 underline hover:no-underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  . I will respond within 30 days (GDPR) or 45 days (CCPA) or 90
                  days (DPDP Act), as applicable.
                </p>
                <p>
                  If you are in the EU, you also have the right to lodge a
                  complaint with your local data protection authority. If you
                  are in India, you may file a complaint with the Data
                  Protection Board of India.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                9. Children&apos;s privacy
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  {SITE_NAME} is not intended for children under the age of 13.
                  I do not knowingly collect personal information from children
                  under 13.
                </p>
                <p>
                  Under India&apos;s DPDP Act, I do not process the personal
                  data of children without verifiable parental consent. If you
                  believe a child has provided me with personal information,
                  please contact me so I can delete it.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                10. Security
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  I take reasonable measures to protect your personal data from
                  unauthorized access, alteration, or destruction. These
                  measures include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Encryption of data in transit (HTTPS/TLS)</li>
                  <li>Secure authentication via Google OAuth 2.0</li>
                  <li>Automatic deletion of letters after expiry</li>
                  <li>Access controls on the infrastructure</li>
                </ul>
                <p>
                  However, no method of transmission or storage is 100% secure.
                  I cannot guarantee absolute security of your data.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                11. Changes to this policy
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  I may update this Privacy Policy from time to time. When I do,
                  I will update the &ldquo;Last updated&rdquo; date at the top
                  of this page. For material changes, I will provide notice
                  through the service or by email.
                </p>
                <p>
                  Your continued use of {SITE_NAME} after changes are posted
                  means you accept the updated policy.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                12. Contact
              </h2>
              <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  For any questions about this Privacy Policy, how I handle your
                  data, or to exercise your data rights, contact me at{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-gray-900 dark:text-gray-100 underline hover:no-underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Data controller: {AUTHOR_NAME}, India
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

export default Privacy