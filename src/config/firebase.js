// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpiIaHBeE-KMPu7Dga2xhnf2Jm5qF526A",
  authDomain: "fir-6c7ae.firebaseapp.com",
  projectId: "fir-6c7ae",
  storageBucket: "fir-6c7ae.appspot.com",
  messagingSenderId: "184554640202",
  appId: "1:184554640202:web:e1e8bdee2e120c100967b3",
  measurementId: "G-PN1CZC6VDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)