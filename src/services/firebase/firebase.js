// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDIFelqsl3GB7kLHTRJkWvT2-sOx0FtwEU',
  authDomain: 'clerk-task.firebaseapp.com',
  projectId: 'clerk-task',
  storageBucket: 'clerk-task.appspot.com',
  messagingSenderId: '381652016570',
  appId: '1:381652016570:web:daec6bde8179bd90a95183',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize Firestore and Auth
const db = getDatabase(app)
const auth = getAuth(app)
const storage = getStorage(app)
export { auth, db, storage }
