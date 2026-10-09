/* src/pages/Home.tsx */
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Header, Footer, Pattern, FromTo, Message } from '../core/components/layout'
import { Button, Card, Container, LoginModal } from '../core/components/ui'
import { Editor } from '../letter/Editor'
import type { PatternId } from '../letter/patterns'
import { authClient } from '../core/lib/auth-client'
import { createLetter, getMe } from '../core/lib/api'

const DEFAULT_LETTER_CONFIG = {
  background: 'blue',
  effect: 'hearts',
  textVariant: 'romantic',
  textAnimation: 'none',
  messageBox: { variant: 'romantic', animation: 'fade' },
  header: { enabled: false, text: '', variant: 'romantic', animation: 'fade' },
  buttons: {
    yes: {
      text: 'Yes',
      color: 'green',
      shape: 'pill',
      size: 'md',
      variant: 'solid',
      animation: 'pulse',
    },
    no: {
      text: 'No',
      color: 'gray',
      shape: 'pill',
      size: 'md',
      variant: 'solid',
      animation: 'runaway',
    },
  },
  button: {
    text: 'Accept',
    color: 'green',
    shape: 'pill',
    size: 'md',
    variant: 'solid',
    animation: 'pulse',
  },
  submitButton: {
    text: 'Submit',
    color: 'blue',
    shape: 'rounded',
    size: 'md',
    variant: 'solid',
    animation: 'none',
  },
}

export function Home() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [pattern, setPattern] = useState<PatternId>('two-choice')
  const [message, setMessage] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [letterConfig, setLetterConfig] = useState<any>(DEFAULT_LETTER_CONFIG)

  useEffect(() => {
    getMe()
      .then((userData) => setUser(userData))
      .finally(() => setIsLoading(false))
  }, [])

  const handleConfigUpdate = (key: string, value: any) => {
    setLetterConfig({ ...letterConfig, [key]: value })
  }

  const handleGenerateLink = async () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    if (!message || !recipientName || !senderName) {
      setErrorMessage('Fill sender name, recipient name, and message')
      return
    }

    setErrorMessage('')
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
    } catch (error: any) {
      setErrorMessage(error.message ?? 'Something went wrong')
    } finally {
      setIsCreating(false)
    }
  }

  const handleLogout = async () => {
    await authClient.signOut()
    setUser(null)
  }

  const handleLoginSuccess = () => {
    getMe().then((userData) => setUser(userData))
    setIsLoginModalOpen(false)
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
        onSuccess={handleLoginSuccess}
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
                <p className="text-sm text-blue-800 font-medium mb-2">
                  Your link is ready
                </p>
                <code className="text-xs break-all block bg-white p-4 rounded-lg border border-blue-100">
                  {generatedLink}
                </code>
              </motion.div>
            )}
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  )
}