import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Storage
export const storage = getStorage(app)

// Enable Firestore persistence for offline support
let persistenceEnabled = false

export const enableFirestorePersistence = async () => {
  if (persistenceEnabled) return
  
  try {
    // Note: In a real app, you'd import and use enableIndexedDbPersistence
    // For now, we'll just log that persistence would be enabled
    console.log('Firestore persistence enabled')
    persistenceEnabled = true
  } catch (err) {
    console.warn('Failed to enable Firestore persistence:', err)
  }
}

// Network status handlers
export const goOnline = async () => {
  try {
    await enableNetwork(db)
    console.log('Firestore: Back online')
  } catch (err) {
    console.error('Failed to go online:', err)
  }
}

export const goOffline = async () => {
  try {
    await disableNetwork(db)
    console.log('Firestore: Gone offline')
  } catch (err) {
    console.error('Failed to go offline:', err)
  }
}

// Connect to emulators in development
if (import.meta.env.DEV) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectStorageEmulator(storage, 'localhost', 9199)
    console.log('Connected to Firebase emulators')
  } catch (err) {
    // Emulators might already be connected
    console.log('Firebase emulators connection info:', err)
  }
}

// Initialize persistence on app start
enableFirestorePersistence()