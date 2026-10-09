/* src/pages/LetterView.tsx */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { FaCamera, FaDownload } from 'react-icons/fa'
import { Footer } from '../core/components/layout/Footer'
import { PATTERNS, type PatternId } from '../letter/patterns'
import { getLetter, replyLetter, saveNote } from '../core/lib/api'
import { renderLetterToCanvas, downloadDataUrl } from '../core/lib/canvas'
import { generateStandaloneHTML } from '../core/lib/standalone-html'

export function LetterView() {
  const { sender, slug } = useParams()
  const [letter, setLetter] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [existingReply, setExistingReply] = useState<{ reply: string; note: string } | null>(null)

  useEffect(() => {
    if (!sender || !slug) return
    getLetter(sender, slug)
      .then((data) => {
        setLetter(data)
        if (data.status === 'replied') {
          setExistingReply({
            reply: data.reply ?? '',
            note: data.replyNote ?? '',
          })
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [sender, slug])

  const handleReply = async (replyText: string) => {
    if (!sender || !slug) return
    await replyLetter(sender, slug, replyText)
    setExistingReply({ reply: replyText, note: '' })
  }

  const handleNote = async (note: string) => {
    if (!sender || !slug) return
    await saveNote(sender, slug, note)
    setExistingReply((prev) => (prev ? { ...prev, note } : { reply: '', note }))
  }

  const handleSaveImage = () => {
    if (!letter) return
    const dataUrl = renderLetterToCanvas({
      recipientName: letter.recipientName,
      message: letter.message,
      reply: existingReply?.reply ?? '',
      note: existingReply?.note ?? '',
    })
    downloadDataUrl(dataUrl, `letter-${slug}.png`)
  }

  const handleDownloadHTML = () => {
    if (!letter) return
    const html = generateStandaloneHTML({
      recipientName: letter.recipientName,
      message: letter.message,
      reply: existingReply?.reply ?? '',
      note: existingReply?.note ?? '',
      background: letter.config.background,
      effect: letter.config.effect,
      messageBoxVariant: letter.config.messageBox.variant,
      textVariant: letter.config.textVariant,
      textAnimation: letter.config.textAnimation,
    })
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    downloadDataUrl(url, `letter-${slug}.html`)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading letter...</div>
      </div>
    )
  }

  if (error || !letter) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Letter not found</h2>
            <p className="text-gray-500">{error || 'This letter may have expired.'}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const actions = existingReply ? (
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
      <div className="flex-1 flex">
        <PatternComponent
          config={{
            ...letter.config,
            message: letter.message,
          }}
          onReply={handleReply}
          onNote={handleNote}
          existingReply={existingReply}
          senderName={letter.senderName}
          recipientName={letter.recipientName}
        />
      </div>
      <Footer actions={actions} />
    </div>
  )
}

export default LetterView