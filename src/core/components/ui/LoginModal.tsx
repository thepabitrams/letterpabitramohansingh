/* src/core/components/ui/LoginModal.tsx */
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FcGoogle } from 'react-icons/fc'
import { authClient } from '../../lib/auth-client'

type LoginModalProps = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: window.location.origin + '/',
      })
    } catch (error: any) {
      setErrorMessage(error.message ?? 'Login failed')
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl"
          >
            <h2 className="text-2xl font-normal text-gray-800 mb-1">Sign in</h2>
            <p className="text-sm text-gray-600 mb-6">to continue to Letter</p>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
            >
              <FcGoogle className="text-xl" />
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            {errorMessage && (
              <p className="text-xs text-red-600 mt-3">{errorMessage}</p>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed">
                By continuing, you agree to receive a letter. Be nice.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoginModal