// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAEdVv-eNDrQIJcquF8m4vJxFw1YmoLJKo",
  authDomain: "super-mart-b298a.firebaseapp.com",
  projectId: "super-mart-b298a",
  storageBucket: "super-mart-b298a.appspot.com",
  messagingSenderId: "221215073762",
  appId: "1:221215073762:web:785463514ea3f8339bc5bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const db = getFirestore(app)

const storage = getStorage(app)

export { db , storage , auth }