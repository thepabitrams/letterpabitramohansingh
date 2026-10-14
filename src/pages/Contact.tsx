// src/pages/Contact.tsx

import { useState } from 'react'
import {
  FaArrowUpRightFromSquare,
  FaCheck,
  FaCopy,
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from 'react-icons/fa6'
import { Footer, Header } from '../core/components/layout'
import { PageMeta } from '../core/seo/PageMeta'
import {
  AUTHOR_NAME,
  CONTACT_EMAIL,
  PORTFOLIO_URL,
  SOCIALS,
} from '../core/seo/constants'

interface Template {
  id: string
  label: string
  description: string
  content: string
}

const TEMPLATES: Template[] = [
  {
    id: 'bug',
    label: 'Bug report',
    description: 'Something is broken or not working as expected.',
    content: `[Bug]: Short description

What happened:

Steps to reproduce:
1. 
2. 
3. 

Expected behavior:

Device/Browser:

Letters version:

Logs / error output:`,
  },
  {
    id: 'feature',
    label: 'Feature request',
    description: 'An idea for something new or an improvement.',
    content: `[Feature]: Short description

What problem does this solve?

What I want:

Why it would help:

Use cases:

Alternatives considered:`,
  },
  {
    id: 'question',
    label: 'Question',
    description: 'A question about how something works.',
    content: `[Question]: Topic

What I want to know:

What I have tried:

Context:`,
  },
]

interface Channel {
  label: string
  href: string
  icon: typeof FaEnvelope
  description: string
  openLabel: string
}

const CHANNELS: Channel[] = [
  {
    label: 'GitHub Issues',
    href: `${SOCIALS.github}/letters/issues`,
    icon: FaGithub,
    description: 'Best for bugs and feature requests. Everything is tracked publicly.',
    openLabel: 'Open GitHub',
  },
  {
    label: 'Email',
    href: `mailto:${CONTACT_EMAIL}`,
    icon: FaEnvelope,
    description: 'For private messages. I reply within a few days.',
    openLabel: 'Send email',
  },
  {
    label: 'X',
    href: SOCIALS.twitter,
    icon: FaXTwitter,
    description: 'Short messages and quick questions.',
    openLabel: 'Open X',
  },
  {
    label: 'Instagram',
    href: SOCIALS.instagram,
    icon: FaInstagram,
    description: 'Direct messages are open.',
    openLabel: 'Open Instagram',
  },
  {
    label: 'LinkedIn',
    href: SOCIALS.linkedin,
    icon: FaLinkedin,
    description: 'For work or collaboration.',
    openLabel: 'Open LinkedIn',
  },
]

export function Contact() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (id: string, content: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // clipboard not available — fail silently
    }
  }

  return (
    <>
      <PageMeta
        title="Contact"
        description="Get in touch with the developer behind Letters. Report bugs, request features, or just say hi."
        path="/contact"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Header
          user={null}
          onLoginClick={() => {}}
          onLogout={() => {}}
        />

        <main className="py-20 px-6">
          <article className="max-w-2xl mx-auto space-y-16">
            <header className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-[1.1] tracking-tight">
                Contact
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Letters is built and maintained by one person. Pick a template
                below, copy it, fill in the details, and send it through any
                channel. The prefix in the subject line helps me sort and reply
                faster.
              </p>
            </header>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Message templates
              </h2>

              <div className="space-y-5">
                {TEMPLATES.map((template) => {
                  const isCopied = copiedId === template.id
                  return (
                    <div
                      key={template.id}
                      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-100 dark:border-gray-800">
                        <div className="space-y-1">
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {template.label}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {template.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(template.id, template.content)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shrink-0 ${
                            isCopied
                              ? 'border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <FaCheck size={11} aria-hidden="true" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <FaCopy size={11} aria-hidden="true" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-5 text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap wrap-break-word leading-relaxed">
                        {template.content}
                      </pre>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Where to send
              </h2>

              <div className="space-y-3">
                {CHANNELS.map((channel) => {
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

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {channel.label}
                          </p>
                          <FaArrowUpRightFromSquare
                            size={10}
                            className="text-gray-400 dark:text-gray-500"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {channel.description}
                        </p>
                      </div>
                    </a>
                  )
                })}
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

export default Contact