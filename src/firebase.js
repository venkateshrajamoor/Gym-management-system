import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {

  apiKey: "AIzaSyAQZPjozILNPtBxAbZU9U4HkJMiTBzu8Ww",
  authDomain: "gym-management-system-4e722.firebaseapp.com",
  projectId: "gym-management-system-4e722",
  storageBucket: "gym-management-system-4e722.firebasestorage.app",
  messagingSenderId: "945959847800",
  appId: "1:945959847800:web:e2640a8c32a0d4009aaa8d",
  measurementId: "G-CR306ZJCX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
const secondaryAuth = getAuth(secondaryApp);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, secondaryAuth};