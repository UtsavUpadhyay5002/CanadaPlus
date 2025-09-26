// Install utilities for PWA

export function isStandalone(): boolean {
  // Check if app is running in standalone mode
  const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
  const isIOSStandalone = (window.navigator as any).standalone === true
  
  return isStandaloneMode || isIOSStandalone
}

export function isIOSDevice(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function isInSafari(): boolean {
  return /^((?!chrome|android|crios|fxios|opios).)*safari/i.test(navigator.userAgent)
}

export function showIOSInstallGuide(): boolean {
  return isIOSDevice() && isInSafari() && !isStandalone()
}

export function setupInstallPrompt(callback: (event: any) => void) {
  let deferredPrompt: any = null

  const handleBeforeInstallPrompt = (e: Event) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    deferredPrompt = e
    callback(e)
    
    // Track that install prompt was shown
    console.log('Analytics: beforeinstallprompt_fired')
  }

  const handleAppInstalled = () => {
    console.log('Analytics: app_installed')
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null
    
    // Store installation state in IndexedDB as fallback
    setInstallationState(true)
  }

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
  }
}

// IndexedDB helpers for persistent install state
export async function setInstallationState(installed: boolean): Promise<void> {
  try {
    const dbRequest = indexedDB.open('CanadaPlusApp', 1)
    
    dbRequest.onupgradeneeded = () => {
      const db = dbRequest.result
      if (!db.objectStoreNames.contains('appState')) {
        db.createObjectStore('appState')
      }
    }
    
    dbRequest.onsuccess = () => {
      const db = dbRequest.result
      const transaction = db.transaction(['appState'], 'readwrite')
      const store = transaction.objectStore('appState')
      store.put(installed, 'installed')
      db.close()
    }
  } catch (error) {
    console.warn('Failed to store installation state:', error)
  }
}

export async function getInstallationState(): Promise<boolean> {
  try {
    return new Promise((resolve) => {
      const dbRequest = indexedDB.open('CanadaPlusApp', 1)
      
      dbRequest.onupgradeneeded = () => {
        const db = dbRequest.result
        if (!db.objectStoreNames.contains('appState')) {
          db.createObjectStore('appState')
        }
      }
      
      dbRequest.onsuccess = () => {
        const db = dbRequest.result
        const transaction = db.transaction(['appState'], 'readonly')
        const store = transaction.objectStore('appState')
        const request = store.get('installed')
        
        request.onsuccess = () => {
          resolve(request.result === true)
          db.close()
        }
        
        request.onerror = () => {
          resolve(false)
          db.close()
        }
      }
      
      dbRequest.onerror = () => {
        resolve(false)
      }
    })
  } catch (error) {
    console.warn('Failed to get installation state:', error)
    return false
  }
}

// Check if device supports PWA installation
export function canInstallPWA(): boolean {
  // Check for basic PWA support
  const hasServiceWorkerSupport = 'serviceWorker' in navigator
  const hasManifestSupport = 'manifest' in document.createElement('link')
  
  return hasServiceWorkerSupport && hasManifestSupport
}

// Get install instructions based on browser/OS
export function getInstallInstructions(): { title: string; steps: string[] } {
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return {
      title: 'Install on Chrome',
      steps: [
        'Tap the menu button (⋮) in Chrome',
        'Select "Add to Home Screen" or "Install App"',
        'Tap "Install" to add Canada+ to your home screen'
      ]
    }
  }
  
  if (userAgent.includes('firefox')) {
    return {
      title: 'Install on Firefox',
      steps: [
        'Tap the menu button (⋮) in Firefox',
        'Select "Add to Home Screen"',
        'Tap "Add" to install Canada+'
      ]
    }
  }
  
  if (userAgent.includes('safari') && isIOSDevice()) {
    return {
      title: 'Install on iPhone/iPad',
      steps: [
        'Tap the Share button (⎘) at the bottom of Safari',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to install Canada+ to your home screen'
      ]
    }
  }
  
  if (userAgent.includes('edg')) {
    return {
      title: 'Install on Microsoft Edge',
      steps: [
        'Tap the menu button (⋯) in Edge',
        'Select "Add to phone" or "Install App"',
        'Tap "Install" to add Canada+ to your home screen'
      ]
    }
  }
  
  // Generic fallback
  return {
    title: 'Install Canada+',
    steps: [
      'Look for an "Install" or "Add to Home Screen" option in your browser menu',
      'Follow the prompts to install Canada+ as an app',
      'Open Canada+ from your home screen for the best experience'
    ]
  }
}