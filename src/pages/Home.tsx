/* src/pages/Home.tsx */
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Header, Footer, Pattern, FromTo, Message } from '../core/components/layout'
import { Button, Card, Container, LoginModal } from '../core/components/ui'
import { Editor } from '../letter/Editor'
import type { PatternId } from '../letter/patterns'
import { authClient } from '../core/lib/auth-client'
import { createLetter, getMe } from '../core/lib/api'

export function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)
  const [pattern, setPattern] = useState<PatternId>('two-choice')
  const [message, setMessage] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [config, setConfig] = useState<any>({
    background: 'blue',
    effect: 'hearts',
    textVariant: 'romantic',
    textAnimation: 'none',
    messageBox: { variant: 'romantic', animation: 'fade' },
    header: { enabled: false, text: '', variant: 'romantic', animation: 'fade' },
    buttons: {
      yes: { text: 'Yes', color: 'green', shape: 'pill', size: 'md', variant: 'solid', animation: 'pulse' },
      no: { text: 'No', color: 'gray', shape: 'pill', size: 'md', variant: 'solid', animation: 'runaway' },
    },
    button: {
      text: 'Accept', color: 'green', shape: 'pill', size: 'md', variant: 'solid', animation: 'pulse',
    },
    submitButton: {
      text: 'Submit', color: 'blue', shape: 'rounded', size: 'md', variant: 'solid', animation: 'none',
    },
  })

  useEffect(() => {
    getMe()
      .then((u) => setUser(u))
      .finally(() => setLoading(false))
  }, [])

  const update = (key: string, value: any) => setConfig({ ...config, [key]: value })

  const handleGenerate = async () => {
    if (!user) return setLoginOpen(true)
    if (!message || !recipientName || !senderName) {
      setError('Fill sender name, recipient name, and message')
      return
    }

    setError('')
    setCreating(true)
    try {
      const result = await createLetter({
        senderName,
        recipientName,
        message,
        header: config.header?.enabled ? config.header.text : undefined,
        pattern,
        config,
        expiryDays: 7,
      })
      setGeneratedLink(`${window.location.origin}${result.url}`)
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong')
    } finally {
      setCreating(false)
    }
  }

  const handleLogout = async () => {
    await authClient.signOut()
    setUser(null)
  }

  if (loading) {
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
        onLoginClick={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          getMe().then((u) => setUser(u))
          setLoginOpen(false)
        }}
      />

      <main className="py-6 px-4">
        <Container>
          <Pattern selected={pattern} onSelect={setPattern} />

          <FromTo
            senderName={senderName} setSenderName={setSenderName}
            recipientName={recipientName} setRecipientName={setRecipientName}
          />

          <Message message={message} setMessage={setMessage} />

          <Editor
            pattern={pattern}
            message={message}
            senderName={senderName}
            recipientName={recipientName}
            config={config}
            update={update}
          />

          <Card title="Generate" className="text-center">
            <Button onClick={handleGenerate} size="lg" disabled={creating}>
              {creating ? 'Creating...' : 'Generate Link'}
            </Button>
            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}
            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto"
              >
                <p className="text-sm text-blue-800 font-medium mb-2">Your link is ready</p>
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