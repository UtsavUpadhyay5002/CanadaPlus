// Accessibility utilities

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Check if user prefers high contrast
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Check if user prefers dark mode
export function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Focus management utilities
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

// Announce to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  
  document.body.appendChild(announcement)
  
  // Use setTimeout to ensure the element is in the DOM before setting text
  setTimeout(() => {
    announcement.textContent = message
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, 100)
}

// Check if element is visible to screen readers
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  
  return !(
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0' ||
    element.hasAttribute('aria-hidden')
  )
}

// Generate unique ID for accessibility labels
export function generateId(prefix: string = 'element'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// Skip link functionality
export function addSkipLink(targetId: string, linkText: string = 'Skip to main content') {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = linkText
  skipLink.className = 'skip-link'
  
  // Style the skip link
  Object.assign(skipLink.style, {
    position: 'absolute',
    top: '-40px',
    left: '6px',
    background: '#000',
    color: '#fff',
    padding: '8px',
    textDecoration: 'none',
    borderRadius: '4px',
    zIndex: '1000',
    transition: 'top 0.3s'
  })
  
  // Show skip link on focus
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px'
  })
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px'
  })
  
  document.body.insertBefore(skipLink, document.body.firstChild)
  
  return skipLink
}

// Color contrast checker (simplified)
export function checkColorContrast(color1: string, color2: string): { ratio: number; wcagAA: boolean; wcagAAA: boolean } {
  // This is a simplified version - in a real app you'd use a proper color contrast library
  // For now, we'll return a mock result
  return {
    ratio: 4.5, // Assuming good contrast
    wcagAA: true,
    wcagAAA: false
  }
}

// Set up global accessibility features
export function setupAccessibility() {
  // Add skip link to main content
  const mainContent = document.getElementById('root')
  if (mainContent) {
    addSkipLink('root', 'Skip to main content')
  }

  // Handle prefers-reduced-motion
  if (prefersReducedMotion()) {
    document.documentElement.classList.add('reduce-motion')
  }

  // Handle high contrast preference
  if (prefersHighContrast()) {
    document.documentElement.classList.add('high-contrast')
  }

  // Set up global keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Escape key to close modals/overlays
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]')
      if (activeModal) {
        const closeButton = activeModal.querySelector('[aria-label*="close"], [aria-label*="dismiss"]')
        if (closeButton instanceof HTMLElement) {
          closeButton.click()
        }
      }
    }
  })

  console.log('Accessibility features initialized')
}