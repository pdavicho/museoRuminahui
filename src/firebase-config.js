// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBaX_7l5TQWvof3vicaaNMASyQyKXArz18",
  authDomain: "museo-cultural.firebaseapp.com",
  projectId: "museo-cultural",
  storageBucket: "museo-cultural.firebasestorage.app",
  messagingSenderId: "839414481426",
  appId: "1:839414481426:web:49f02e740628f0d802cecb",
  measurementId: "G-2VGMDSD32R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);