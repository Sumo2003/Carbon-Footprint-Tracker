// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration (fixed storage bucket ✅)
const firebaseConfig = {
  apiKey: "AIzaSyAsoE0frwcri_rvVjehx7DFPbxAOXAnjVc",
  authDomain: "carbon-footprint-tracker-bbd6e.firebaseapp.com",
  projectId: "carbon-footprint-tracker-bbd6e",
  storageBucket: "carbon-footprint-tracker-bbd6e.appspot.com",  // ✅ fixed
  messagingSenderId: "172226476666",
  appId: "1:172226476666:web:6fcfc612db26f9cad2d9c3",
  measurementId: "G-9NGVSJNEXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in project
export const auth = getAuth(app);
export const db = getFirestore(app);
