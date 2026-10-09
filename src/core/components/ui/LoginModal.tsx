/* src/ui/layout/LoginModal.tsx */
import { motion, AnimatePresence } from 'motion/react'
import { FaGoogle, FaTimes } from 'react-icons/fa'

type Props = {
  open: boolean
  onClose: () => void
  onGoogleLogin: () => void
}

export function LoginModal({ open, onClose, onGoogleLogin }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-pink-600 mb-2 text-center">Welcome 💌</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Sign in to create your letter</p>
            <button
              onClick={onGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3 font-semibold hover:bg-gray-50 transition"
            >
              <FaGoogle className="text-red-500" />
              Continue with Google
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              By signing in, you agree to be nice 💕
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}