import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Zap, Globe, ChevronDown, X } from 'lucide-react'
import { setupInstallPrompt, isStandalone, showIOSInstallGuide } from './install'

function App() {
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  useEffect(() => {
    // Redirect to app if already installed
    if (isStandalone()) {
      window.location.href = '/app'
      return
    }

    // Setup install prompt handling
    const cleanup = setupInstallPrompt((event) => {
      setCanInstall(true)
      setInstallPrompt(event)
    })

    return cleanup
  }, [])

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        console.log('PWA installed')
      }
      setInstallPrompt(null)
      setCanInstall(false)
    } else {
      // Show iOS guide or open app
      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        setShowIOSGuide(true)
      } else {
        // Fallback - open the app
        window.location.href = '/app'
      }
    }
  }

  const handleOpenApp = () => {
    window.location.href = '/app'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C+</span>
          </div>
          <span className="font-bold text-xl text-gray-900">Canada+</span>
        </div>
        
        <button
          onClick={canInstall || isStandalone() ? handleInstall : handleOpenApp}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          {isStandalone() ? 'Open App' : canInstall ? 'Install App' : 'Get Started'}
        </button>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Canada's stories,
              <span className="text-red-600 block">swipe by swipe</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover the most important Canadian news in a beautiful, mobile-first format. 
              Politics, culture, local stories, and more — delivered the way you want to consume them.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleInstall}
                className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                {canInstall ? 'Install Now' : 'Get Started'}
              </button>
              
              <button
                onClick={() => setShowIOSGuide(true)}
                className="text-red-600 px-8 py-4 rounded-xl font-medium hover:bg-red-50 transition-colors border border-red-200"
              >
                How to install on iPhone
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
              <div className="bg-white rounded-[2.5rem] p-6 aspect-[9/19] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold text-xs">C+</span>
                    </div>
                    <span className="font-semibold text-gray-900">Canada+</span>
                  </div>
                  <div className="text-xs text-gray-500">9:41</div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="bg-red-600 rounded-2xl p-4 text-white">
                    <h3 className="font-semibold text-sm mb-2">Federal Budget 2024</h3>
                    <p className="text-xs opacity-90">New housing initiatives announced for major Canadian cities...</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs">CBC News</span>
                      <span className="text-xs">2h ago</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500 rounded-2xl p-4 text-white">
                    <h3 className="font-semibold text-sm mb-2">Tech Innovation</h3>
                    <p className="text-xs opacity-90">Toronto startup raises $50M for AI healthcare platform...</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs">Globe & Mail</span>
                      <span className="text-xs">4h ago</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-500 rounded-2xl p-4 text-white">
                    <h3 className="font-semibold text-sm mb-2">Climate Action</h3>
                    <p className="text-xs opacity-90">BC announces new carbon reduction targets for 2025...</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs">National Post</span>
                      <span className="text-xs">6h ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Mobile-First</h3>
            <p className="text-gray-600">Designed for how you actually consume news on your phone. Swipe through stories like your favorite social app.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Lightning Fast</h3>
            <p className="text-gray-600">Instant loading, offline support, and smooth animations. News shouldn't make you wait.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
              <Globe className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Truly Canadian</h3>
            <p className="text-gray-600">From coast to coast to coast. Local stories, national issues, and the perspectives that matter to Canadians.</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 text-center bg-gray-900 rounded-3xl p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to stay informed?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Canadians who get their daily news fix with Canada+. 
            Install now for the best experience.
          </p>
          
          <button
            onClick={handleInstall}
            className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            {canInstall ? 'Install Canada+' : 'Get Started'}
          </button>
        </motion.div>
      </main>

      {/* iOS Install Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Install on iPhone</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">1</div>
                <p>Tap the Share button at the bottom of Safari</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
                <p>Scroll down and tap "Add to Home Screen"</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
                <p>Tap "Add" to install Canada+ to your home screen</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-medium mt-6 hover:bg-red-700 transition-colors"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default App