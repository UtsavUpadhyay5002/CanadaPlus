import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smartphone, Download } from 'lucide-react'
import { setupInstallPrompt, showIOSInstallGuide } from '../lib/install'

interface SoftGateProps {
  onDismiss: () => void
  onContinue: () => void
}

function SoftGate({ onDismiss, onContinue }: SoftGateProps) {
  const [canInstall, setCanInstall] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Setup install prompt handling
    const cleanup = setupInstallPrompt((event) => {
      setCanInstall(true)
      setInstallPrompt(event)
    })

    // Track that soft gate was shown
    console.log('Analytics: install_prompt_shown')

    return cleanup
  }, [])

  const handleInstall = async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('Analytics: install_accepted')
        setIsVisible(false)
        onDismiss()
      }
      
      setInstallPrompt(null)
      setCanInstall(false)
    } else if (showIOSInstallGuide()) {
      setShowIOSGuide(true)
    } else {
      // Fallback - just dismiss the gate
      handleContinueOnWeb()
    }
  }

  const handleContinueOnWeb = () => {
    setIsVisible(false)
    onContinue()
  }

  const handleCloseIOSGuide = () => {
    setShowIOSGuide(false)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Main Soft Gate Banner */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-500 text-white p-4 z-40 shadow-lg"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Get the full experience</h3>
              <p className="text-xs text-white/90 truncate">Install Canada+ for the best reading experience</p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-center space-x-3 mt-3 max-w-md mx-auto">
          <button
            onClick={handleInstall}
            className="flex items-center space-x-2 bg-white text-red-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex-1 justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Install</span>
          </button>
          
          <button
            onClick={handleContinueOnWeb}
            className="text-white/90 text-xs hover:text-white transition-colors underline"
          >
            Continue on web
          </button>
        </div>
      </motion.div>

      {/* iOS Install Guide Modal */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Install on iPhone</h3>
                <button
                  onClick={handleCloseIOSGuide}
                  className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-white mb-1">Tap the Share button</p>
                    <p className="text-gray-400">Look for the share icon at the bottom of Safari</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-white mb-1">Add to Home Screen</p>
                    <p className="text-gray-400">Scroll down and tap "Add to Home Screen"</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-white mb-1">Confirm installation</p>
                    <p className="text-gray-400">Tap "Add" to install Canada+ to your home screen</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCloseIOSGuide}
                  className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
                >
                  Got it
                </button>
                
                <button
                  onClick={() => {
                    handleCloseIOSGuide()
                    handleContinueOnWeb()
                  }}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Continue anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SoftGate