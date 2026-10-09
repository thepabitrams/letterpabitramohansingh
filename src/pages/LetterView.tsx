/* src/pages/LetterView.tsx */
import { useState } from 'react'
import { useParams } from 'react-router'
import { motion } from 'motion/react'
import { Footer } from '../core/components/layout/Footer'
import { PATTERNS, type PatternId } from '../letter/patterns'

export function LetterView() {
  const { sender, slug } = useParams()
  const [replied, setReplied] = useState(false)
  const [reply, setReply] = useState<string | null>(null)
  const [note, setNote] = useState('')

  // Yeh data baad mein DB se aayega
  const letter = {
    pattern: 'two-choice' as PatternId,
    senderName: sender ?? 'Someone',
    recipientName: slug ?? 'You',
    message: 'You are the most beautiful thing that happened to me. Every moment with you feels like a dream. Will you be mine? 💕',
    config: {
      background: 'blue',
      effect: 'hearts',
      textVariant: 'romantic',
      textAnimation: 'fade',
      messageBox: { variant: 'romantic', animation: 'fade' },
      noteEnabled: true,
      header: { enabled: false, text: '', variant: 'romantic', animation: 'fade' },
      buttons: {
        yes: { text: 'Yes 💕', color: 'green', shape: 'pill', size: 'md', variant: 'solid', animation: 'pulse' },
        no: { text: 'No', color: 'gray', shape: 'pill', size: 'md', variant: 'solid', animation: 'runaway' },
      },
    },
  }

  const handleReply = (buttonText: string, replyNote: string) => {
    setReply(buttonText)
    setNote(replyNote)
    setReplied(true)
    // Baad mein DB mein save karenge
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
            <div className="text-6xl mb-4">💕</div>
            <h2 className="text-2xl font-bold text-pink-600 mb-2">
              Thank you!
            </h2>
            <p className="text-gray-600">
              You replied: <strong>{reply}</strong>
            </p>
            {note && (
              <p className="text-gray-500 text-sm mt-3 italic">"{note}"</p>
            )}
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  const PatternComponent = PATTERNS[letter.pattern]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <PatternComponent
          config={{
            ...letter.config,
            message: letter.message,
          } as any}
          onReply={handleReply}
        />
      </div>
      <Footer />
    </div>
  )
}