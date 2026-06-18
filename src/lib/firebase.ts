// Firebase client (web SDK). The web config is public by design — security is
// enforced by Firestore/Storage rules + the admin custom claim, not this key.
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB03JIFVdRUUpXmymmTzrbuFRQ2bWTp5KI",
  authDomain: "vbc-cross-platform.firebaseapp.com",
  projectId: "vbc-cross-platform",
  storageBucket: "vbc-cross-platform.firebasestorage.app",
  messagingSenderId: "42370225570",
  appId: "1:42370225570:web:606311bd16e7e19a330efb",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
