import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBphywalrkr8wUSYR89LMN_QHCYgY29VQA",
  authDomain: "epeler-2a794.firebaseapp.com",
  projectId: "epeler-2a794",
  storageBucket: "epeler-2a794.firebasestorage.app",
  messagingSenderId: "380803612580",
  appId: "1:380803612580:web:49e6d1bcaae922c4c54b31",
  measurementId: "G-JJK74JEVZ3"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
