/* src/pages/LetterView.tsx */
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { FaCamera, FaDownload } from 'react-icons/fa'
import { Footer } from '../core/components/layout/Footer'
import { PATTERNS, type PatternId } from '../letter/patterns'
import { getLetter, replyLetter, saveNote } from '../core/lib/api'
import { generateStandaloneHTML } from '../core/lib/export/html'
import { captureLetterAsImage, downloadDataUrl } from '../core/lib/export/image'

type ReplyState = {
  reply: string
  note: string | null
}

export function LetterView() {
  const { sender, slug } = useParams()
  const [letter, setLetter] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [replyState, setReplyState] = useState<ReplyState | null>(null)
  const letterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sender || !slug) return

    getLetter(sender, slug)
      .then((letterData) => {
        setLetter(letterData)
        if (letterData.status === 'replied' || letterData.replyNote !== null) {
          setReplyState({
            reply: letterData.reply ?? '',
            note: letterData.replyNote ?? null,
          })
        }
      })
      .catch((error) => setErrorMessage(error.message))
      .finally(() => setIsLoading(false))
  }, [sender, slug])

  const handleReply = async (replyText: string) => {
    if (!sender || !slug) return
    await replyLetter(sender, slug, replyText)
    setReplyState({ reply: replyText, note: null })
  }

  const handleNote = async (noteText: string) => {
    if (!sender || !slug) return
    await saveNote(sender, slug, noteText)
    setReplyState((previousState) =>
      previousState
        ? { ...previousState, note: noteText }
        : { reply: '', note: noteText }
    )
  }

  const handleSaveImage = async () => {
    if (!letterRef.current) return

    try {
      const dataUrl = await captureLetterAsImage(letterRef.current)
      downloadDataUrl(dataUrl, `letter-${slug}.png`)
    } catch (error) {
      console.error('Failed to capture image:', error)
    }
  }

  const handleDownloadHTML = () => {
    if (!letter) return

    const html = generateStandaloneHTML({
      senderName: letter.senderName,
      recipientName: letter.recipientName,
      message: letter.message,
      reply: replyState?.reply ?? '',
      note: replyState?.note ?? '',
      pattern: letter.pattern,
      background: letter.config.background,
      backgroundAnimation: letter.config.backgroundAnimation,
      effect: letter.config.effect,
      textVariant: letter.config.textVariant,
      textAnimation: letter.config.textAnimation,
      messageBoxVariant: letter.config.messageBox.variant,
      messageBoxAnimation: letter.config.messageBox.animation,
    })

    const blob = new Blob([html], { type: 'text/html' })
    const blobUrl = URL.createObjectURL(blob)
    downloadDataUrl(blobUrl, `letter-${slug}.html`)
    URL.revokeObjectURL(blobUrl)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading letter...</div>
      </div>
    )
  }

  if (errorMessage || !letter) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Letter not found</h2>
            <p className="text-gray-500">
              {errorMessage || 'This letter may have expired.'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const isNoteSubmitted = replyState !== null && replyState.note !== null

  const footerActions = isNoteSubmitted ? (
    <>
      <button
        onClick={handleSaveImage}
        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition"
      >
        <FaCamera />
        Save as Image
      </button>
      <button
        onClick={handleDownloadHTML}
        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition"
      >
        <FaDownload />
        Download HTML
      </button>
    </>
  ) : null

  const PatternComponent = PATTERNS[letter.pattern as PatternId]

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={letterRef} className="flex-1 flex">
        <PatternComponent
          config={{
            ...letter.config,
            message: letter.message,
          }}
          onReply={handleReply}
          onNote={handleNote}
          existingReply={replyState}
          senderName={letter.senderName}
          recipientName={letter.recipientName}
        />
      </div>
      <Footer actions={footerActions} />
    </div>
  )
}

export default LetterView