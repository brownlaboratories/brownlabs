import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBaRLPVC5Kq81TlbunOEa9PWvFUW5861D4",
  authDomain: "brownlabs-207ec.firebaseapp.com",
  projectId: "brownlabs-207ec",
  storageBucket: "brownlabs-207ec.appspot.com",
  messagingSenderId: "893453567098",
  appId: "1:893453567098:web:29f124cda6d966f9ede7c3",
  measurementId: "G-93XD1L0ZYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
