/* src/pages/LetterView.tsx */
import { useState } from 'react'
import { useParams } from 'react-router'
import { motion } from 'motion/react'
import { Footer } from '../core/components/layout/Footer'
import { PRESETS } from '../letter/presets'
import type { PresetId } from '../letter/presets'

export function LetterView() {
  const { sender, slug } = useParams()
  const [replied, setReplied] = useState(false)
  const [reply, setReply] = useState<'yes' | 'no' | null>(null)

  const letter = {
    preset: 'love' as PresetId,
    message:
      'You are the most beautiful thing that happened to me. Every moment with you feels like a dream. Will you be mine? 💕',
    recipientName: slug ?? 'You',
    senderName: sender ?? 'Someone',
  }

  const handleReply = (r: 'yes' | 'no') => {
    setReply(r)
    setReplied(true)
  }

  if (replied) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center"
          >
            <div className="text-6xl mb-4">{reply === 'yes' ? '💕' : '💔'}</div>
            <h2 className="text-2xl font-bold text-pink-600 mb-2">
              {reply === 'yes' ? 'Thank you!' : 'Thank you for your reply'}
            </h2>
            <p className="text-gray-600">Your response has been recorded.</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  const PresetComponent = PRESETS[letter.preset]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <PresetComponent
          message={letter.message}
          senderName={letter.senderName}
          recipientName={letter.recipientName}
          onReply={handleReply}
        />
      </div>
      <Footer />
    </div>
  )
}