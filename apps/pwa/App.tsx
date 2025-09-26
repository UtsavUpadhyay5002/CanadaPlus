import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Feed from './components/Feed'
import SoftGate from './components/SoftGate'
import TopBar from './components/TopBar'
import { isStandalone } from './lib/install'

function App() {
  const [showSoftGate, setShowSoftGate] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    // Check if we should show soft gate
    const standalone = isStandalone()
    if (!standalone) {
      // Small delay to avoid flash on page load
      const timer = setTimeout(() => {
        setShowSoftGate(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleDismissSoftGate = () => {
    setShowSoftGate(false)
    // Remember dismissal for this session
    sessionStorage.setItem('softGateDismissed', 'true')
  }

  const handleContinueOnWeb = () => {
    setShowSoftGate(false)
    // Track analytics event
    console.log('Analytics: continue_on_web_clicked')
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Offline Indicator */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="absolute top-0 left-0 right-0 bg-yellow-600 text-black px-4 py-2 text-center text-sm font-medium z-50"
          >
            You're offline - showing cached stories
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soft Gate */}
      <AnimatePresence>
        {showSoftGate && !sessionStorage.getItem('softGateDismissed') && (
          <SoftGate
            onDismiss={handleDismissSoftGate}
            onContinue={handleContinueOnWeb}
          />
        )}
      </AnimatePresence>

      {/* Top Bar - only show in standalone mode */}
      {isStandalone() && <TopBar />}

      {/* Main Feed */}
      <div className={`h-full ${isStandalone() ? 'pt-14' : ''} ${isOffline ? 'pt-10' : ''}`}>
        <Feed />
      </div>
    </div>
  )
}

export default App