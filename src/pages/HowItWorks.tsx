// src/pages/HowItWorks.tsx

import {
  FaArrowUpRightFromSquare,
  FaEnvelope,
  FaGoogle,
  FaLayerGroup,
  FaLink,
  FaPen,
  FaWandMagicSparkles,
} from 'react-icons/fa6'
import { Footer, Header } from '../core/components/layout'
import { PageMeta } from '../core/seo/PageMeta'
import {
  AUTHOR_NAME,
  PORTFOLIO_URL,
  SITE_NAME,
} from '../core/seo/constants'

const WRITING_STEPS = [
  {
    icon: FaGoogle,
    title: 'Sign in with Google',
    description:
      'One quick sign-in and you are in. No email forms, no passwords to remember. Google handles the security so we never see your credentials.',
  },
  {
    icon: FaLayerGroup,
    title: 'Pick your letter style',
    description:
      'Choose between three patterns. Two Choice gives your recipient a Yes/No pair of buttons. One Choice gives them a single button. Note Only skips buttons entirely — just a reply field.',
  },
  {
    icon: FaPen,
    title: 'Write who it is from and who it is for',
    description:
      'Two names. Both appear on the letter and in the animations, so the letter feels like it was made specifically for that person.',
  },
  {
    icon: FaEnvelope,
    title: 'Write your message',
    description:
      'This is the actual letter. Say what you want to say. Ask a question. Tell them how you feel. There is no character limit pushing you to rush.',
  },
  {
    icon: FaWandMagicSparkles,
    title: 'Make it yours',
    description:
      'Change the background, fonts, effects, and button style. Every section is editable, so the letter looks the way you want it to feel.',
  },
  {
    icon: FaLink,
    title: 'Get your link',
    description:
      'Generate a link and send it to the person you wrote it for. That link is the letter — anyone who opens it can read it, reply to it, and save a copy.',
  },
] as const

export function HowItWorks() {
  return (
    <>
      <PageMeta
        title="How It Works"
        description={`Learn how ${SITE_NAME} works — write a personalized letter, customize it, and send it as a self-destructing link.`}
        path="/how-it-works"
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
                How it works
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Six steps to write something that matters. No feed, no profile
                to build, no algorithm deciding who sees it. Just a message
                from you to one person.
              </p>
            </header>

            <section className="space-y-10">
              {WRITING_STEPS.map((step, index) => {
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
                Sharing the link
              </h2>
              <div className="space-y-5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  The link is the letter. Anyone who has it can open the letter,
                  reply to it, and save a copy. That is why the order matters.
                </p>
                <p>
                  Send it to the person you wrote it for first. Let them read
                  it, reply to it, and save it if they want to. After they
                  reply, you are free to show the letter to others — the reply
                  will be there for them to see too.
                </p>
                <p>
                  If you share it too broadly before they have seen it, someone
                  else could reply first. The link is not locked to a single
                  person, so choose who you send it to with care.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                What your recipient sees
              </h2>
              <div className="space-y-5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  When they open the link, the letter appears with the animation
                  you chose. Their name and yours show up on screen as part of
                  the moment — that is why we ask for both.
                </p>
                <p>
                  Depending on the pattern you picked, they can reply with a
                  Yes/No, with a single button, or with a note. Then they can
                  save the whole thing as an image or download it as an HTML
                  file, if they want to keep it.
                </p>
                <p>
                  After they reply, they can come back to the same link to read
                  it again, as long as the letter is still alive.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                How long a letter lasts
              </h2>
              <div className="space-y-5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  A new letter stays on the server for its full expiry period —
                  seven days by default. Once the recipient opens it, the clock
                  shortens to half that time. So the sooner they open it, the
                  shorter its remaining life.
                </p>
                <p>
                  If the storage is running low, the oldest active letters are
                  deleted first to make room. Letters that have already expired
                  are cleaned up automatically.
                </p>
                <p>
                  This is why saving a copy matters. What you download to your
                  device is yours forever. What stays on the server is
                  temporary by design.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Saving a copy
              </h2>
              <div className="space-y-5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  After a letter is replied to, both the sender and the
                  recipient can save it as a PNG image or download it as a
                  standalone HTML file. The image is a snapshot. The HTML file
                  is a small interactive page that keeps the original animation.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Note: the downloaded HTML file needs an internet connection to
                  load fonts and animation libraries from a CDN. It is not fully
                  offline.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Everything else
              </h2>
              <div className="space-y-5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  All the links you need — About, Contact, Privacy, Terms — live
                  in the footer at the bottom of every page. If you want to
                  support the project, there is a Buy Me a Coffee button right
                  next to them.
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

export default HowItWorks