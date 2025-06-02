// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC-Fw8pNwVsyJKlp7gqMH_eN19pO0uTknA",
  authDomain: "datawisercv2.firebaseapp.com",
  projectId: "datawisercv2",
  storageBucket: "datawisercv2.appspot.com",
  messagingSenderId: "542677072464",
  appId: "1:542677072464:web:704a564c89a04222adef55",
};

// ✅ Initialize Firebase core
const app = initializeApp(firebaseConfig);

// ✅ Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Google Sign-in
const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login failed:", error.message);
    throw error;
  }
};

// ✅ Email login with session persistence
export const loginWithPersistence = async (email, password) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Email login failed:", error.message);
    throw error;
  }
};

// ✅ Export base modules
export { auth, db };
