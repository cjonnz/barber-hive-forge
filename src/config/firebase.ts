import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDoxwAIPLimxr8-iGThR_w-funOG4JSjl8",
  authDomain: "nexus-app-cf58e.firebaseapp.com",
  projectId: "nexus-app-cf58e",
  storageBucket: "nexus-app-cf58e.firebasestorage.app",
  messagingSenderId: "730144730075",
  appId: "1:730144730075:web:405367c255d520322a95fe",
  measurementId: "G-5STG89PF46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
