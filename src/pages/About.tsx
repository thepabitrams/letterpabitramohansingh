// src/pages/About.tsx

import {
  FaArrowUpRightFromSquare,
  FaGithub,
} from 'react-icons/fa6'
import { Footer, Header } from '../core/components/layout'
import { PageMeta } from '../core/seo/PageMeta'
import { buildAboutPageSchema } from '../core/seo/structured-data'
import {
  AUTHOR_NAME,
  PORTFOLIO_URL,
  SITE_NAME,
  SOCIALS,
} from '../core/seo/constants'

export function About() {
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
          user={null}
          onLoginClick={() => {}}
          onLogout={() => {}}
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
                className="inline-flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FaGithub size={16} aria-hidden="true" />
                <span>View the source on GitHub</span>
                <FaArrowUpRightFromSquare
                  size={12}
                  className="text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
              </a>
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

export default About