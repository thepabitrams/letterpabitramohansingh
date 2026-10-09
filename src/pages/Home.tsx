/* src/pages/Home.tsx */
import { useState } from 'react'
import { motion } from 'motion/react'
import { Header, Footer, LetterType, FromTo, Message } from '../core/components/layout'
import { Button, Card, Container, LoginModal } from '../core/components/ui'
import { Editor } from '../letter/Editor'
import { PRESET_LIST } from '../letter/presets'
import type { PresetId, LetterConfig } from '../letter/presets/types'

export function Home() {
  const [user, setUser] = useState<any>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [preset, setPreset] = useState<PresetId>('love')
  const [message, setMessage] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [config, setConfig] = useState<LetterConfig>({
    background: 'blue',
    animation: 'hearts',
    messageBoxStyle: 'romantic',
    yesText: 'Yes',
    yesColor: 'green',
    yesShape: 'pill',
    yesAnimation: 'pulse',
    noText: 'No',
    noColor: 'gray',
    noShape: 'pill',
    noRunaway: true,
  })

  const update = (key: keyof LetterConfig, value: any) => setConfig({ ...config, [key]: value })

  const handleGenerate = () => {
    if (!user) return setLoginOpen(true)
    if (!message || !recipientName) return alert('Fill message and recipient name')
    const slug = recipientName.toLowerCase().replace(/\s+/g, '-')
    const sender = (senderName || user.name || 'user').toLowerCase().replace(/\s+/g, '-')
    setGeneratedLink(`${window.location.origin}/${sender}/${slug}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLoginClick={() => setLoginOpen(true)} onLogout={() => setUser(null)} />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onGoogleLogin={() => { setUser({ name: 'Pabitra', image: '' }); setLoginOpen(false) }}
      />

      <main className="py-6 px-4">
        <Container>
          <LetterType
            options={PRESET_LIST}
            selected={preset}
            onSelect={(id) => setPreset(id as PresetId)}
          />

          <FromTo
            senderName={senderName} setSenderName={setSenderName}
            recipientName={recipientName} setRecipientName={setRecipientName}
          />

          <Message message={message} setMessage={setMessage} />

          <Editor
            preset={preset}
            message={message}
            senderName={senderName}
            recipientName={recipientName}
            config={config}
            update={update}
          />

          <Card title="Generate" className="text-center">
            <Button onClick={handleGenerate} size="lg">Generate Link</Button>
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