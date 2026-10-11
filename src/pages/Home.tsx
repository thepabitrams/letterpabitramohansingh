/* src/pages/Home.tsx */
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { FaCheck, FaCopy } from 'react-icons/fa'
import { Footer, FromTo, Header, Message, Pattern } from '../core/components/layout'
import { Button, Card, Container, LoginModal } from '../core/components/ui'
import { Editor } from '../letter/editor'
import type { PatternId } from '../letter/patterns'
import { authClient } from '../core/lib/auth-client'
import { createLetter, getMe } from '../core/lib/api'

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
        expiryDays: 7,
      })

      setGeneratedLink(`${window.location.origin}${result.url}`)
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error))
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Button onClick={() => handleGenerateLink()} size="lg" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Generate Link'}
            </Button>

            {errorMessage && (
              <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
            )}

            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto"
              >
                <p className="text-sm text-blue-800 font-medium mb-3">
                  Your link is ready
                </p>

                <div className="flex items-center gap-2 bg-white rounded-lg border border-blue-100 p-2">
                  <code className="flex-1 text-xs break-all text-left px-2 py-1">
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