// src/pages/Home.tsx

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FaCheck, FaCopy } from 'react-icons/fa'
import { Footer, FromTo, Header, Message, Pattern } from '../core/components/layout'
import { Button, Card, Container, LoginModal } from '../core/components/ui'
import { Editor } from '../letter/editor'
import type { PatternId } from '../letter/patterns'
import { authClient } from '../core/lib/auth-client'
import {
  createLetter,
  getMe,
  checkSlugStatus,
  type CreateLetterConflictError,
  type SlugStatus,
} from '../core/lib/api'
import { PageMeta } from '../core/seo/PageMeta'
import { buildHomeSchemaGraph } from '../core/seo/structured-data'

interface User {
  id: string
  name: string
  email: string
  image?: string | undefined
}

interface ButtonConfig {
  text: string
  color: string
  shape: string
  size: string
  variant: string
  animation: string
}

interface EffectOptions {
  senderLabel?: string
  recipientLabel?: string
  hideLabels?: string
}

interface LetterConfig {
  background: string
  backgroundAnimation: string
  effect: string
  effectOptions?: EffectOptions
  textVariant: string
  textAnimation: string
  messageBox: { variant: string; animation: string }
  header: { enabled: boolean; text: string; variant: string; animation: string }
  buttons: { yes: ButtonConfig; no: ButtonConfig }
  button: ButtonConfig
  submitButton: ButtonConfig
}

const DEFAULT_LETTER_CONFIG: LetterConfig = {
  background: 'blue',
  backgroundAnimation: '',
  effect: '',
  textVariant: 'romantic',
  textAnimation: '',
  messageBox: { variant: 'romantic', animation: '' },
  header: { enabled: false, text: '', variant: 'romantic', animation: '' },
  buttons: {
    yes: { text: 'Yes', color: 'green', shape: 'pill', size: 'md', variant: 'solid', animation: '' },
    no: { text: 'No', color: 'gray', shape: 'pill', size: 'md', variant: 'solid', animation: '' },
  },
  button: { text: 'Accept', color: 'green', shape: 'pill', size: 'md', variant: 'solid', animation: '' },
  submitButton: { text: 'Submit', color: 'blue', shape: 'rounded', size: 'md', variant: 'solid', animation: '' },
}

const HOME_PAGE_TITLE = 'Create & Send Beautiful Personalized Messages'
const HOME_PAGE_DESCRIPTION =
  'Create beautiful personalized letters with Yes/No choices, notes, and romantic messages. Send them to loved ones — they auto-delete after a few days.'

const SLUG_CHECK_DEBOUNCE_MS = 500

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeUser(value: unknown): User | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== 'string') return null
  if (typeof value.name !== 'string') return null
  if (typeof value.email !== 'string') return null

  const image = typeof value.image === 'string' ? value.image : undefined

  return {
    id: value.id,
    name: value.name,
    email: value.email,
    image,
  }
}

function formatAvailableDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function isSlugConflictError(error: unknown): error is CreateLetterConflictError {
  return (
    error instanceof Error &&
    'existingExpiresAt' in error &&
    typeof (error as CreateLetterConflictError).existingExpiresAt === 'number'
  )
}

export function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [pattern, setPattern] = useState<PatternId>('two-choice')
  const [message, setMessage] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [slugStatus, setSlugStatus] = useState<SlugStatus | null>(null)
  const [letterConfig, setLetterConfig] = useState<LetterConfig>(DEFAULT_LETTER_CONFIG)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    let isCancelled = false

    getMe()
      .then((userData) => {
        if (!isCancelled) setUser(normalizeUser(userData))
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    const trimmedSender = senderName.trim()
    const trimmedRecipient = recipientName.trim()

    if (!trimmedSender || !trimmedRecipient) {
      setSlugStatus(null)
      return
    }

    let isCancelled = false

    const timerId = setTimeout(async () => {
      try {
        const status = await checkSlugStatus(trimmedSender, trimmedRecipient)
        if (!isCancelled) setSlugStatus(status)
      } catch {
        if (!isCancelled) setSlugStatus(null)
      }
    }, SLUG_CHECK_DEBOUNCE_MS)

    return () => {
      isCancelled = true
      clearTimeout(timerId)
    }
  }, [senderName, recipientName])

  const handleConfigUpdate = (key: string, value: unknown) => {
    setLetterConfig((previousConfig) => ({ ...previousConfig, [key]: value }))
  }

  const handleGenerateLink = async (): Promise<void> => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    if (!message || !recipientName || !senderName) {
      setErrorMessage('Fill sender name, recipient name, and message')
      return
    }

    setErrorMessage('')
    setGeneratedLink('')
    setIsCreating(true)

    try {
      const result = await createLetter({
        senderName,
        recipientName,
        message,
        header: letterConfig.header?.enabled ? letterConfig.header.text : undefined,
        pattern,
        config: letterConfig,
      })

      setGeneratedLink(`${window.location.origin}${result.url}`)
    } catch (error: unknown) {
      if (isSlugConflictError(error)) {
        setSlugStatus({
          available: false,
          existingExpiresAt: error.existingExpiresAt,
        })
        setErrorMessage('')
      } else {
        setErrorMessage(getErrorMessage(error))
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error: unknown) {
      console.error('Failed to copy:', error)
    }
  }

  const handleLogout = async (): Promise<void> => {
    await authClient.signOut()
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  const isNameTaken = slugStatus !== null && !slugStatus.available

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <PageMeta
        title={HOME_PAGE_TITLE}
        description={HOME_PAGE_DESCRIPTION}
        path="/"
        structuredData={buildHomeSchemaGraph()}
      />

      <Header
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <main className="py-6 px-4">
        <Container>
          <Pattern selected={pattern} onSelect={setPattern} />

          <FromTo
            senderName={senderName}
            setSenderName={setSenderName}
            recipientName={recipientName}
            setRecipientName={setRecipientName}
          />

          <AnimatePresence initial={false}>
            {isNameTaken && slugStatus && !slugStatus.available && (
              <motion.div
                key="slug-taken"
                initial={{ opacity: 0, height: 0, y: -12 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 p-5">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    This letter name is already taken
                  </p>
                  <p className="mt-1.5 text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                    Someone already used &ldquo;{senderName} → {recipientName}&rdquo;.
                    Try reversing the names (recipient first) or use a slightly different spelling.
                  </p>
                  <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
                    The name becomes available again after{' '}
                    <span className="font-semibold">
                      {formatAvailableDate(slugStatus.existingExpiresAt)}
                    </span>.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Message message={message} setMessage={setMessage} />

          <Editor
            pattern={pattern}
            message={message}
            senderName={senderName}
            recipientName={recipientName}
            config={letterConfig}
            update={handleConfigUpdate}
          />

          <Card title="Generate" className="text-center">
            <Button
              onClick={() => handleGenerateLink()}
              size="lg"
              disabled={isCreating || isNameTaken}
            >
              {isCreating ? 'Creating...' : isNameTaken ? 'Name taken' : 'Generate Link'}
            </Button>

            {errorMessage && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            )}

            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-5 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-xl max-w-2xl mx-auto"
              >
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-3">
                  Your link is ready
                </p>

                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg border border-blue-100 dark:border-blue-900 p-2">
                  <code className="flex-1 text-xs break-all text-left px-2 py-1 text-gray-800 dark:text-gray-200">
                    {generatedLink}
                  </code>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition shrink-0 ${
                      isCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <FaCheck />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FaCopy />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  )
}