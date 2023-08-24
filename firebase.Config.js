import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

 const firebaseConfig = {
    apiKey: "AIzaSyDtoPdbUp8cyfsVHbBdRsSQv8iQsgdvQ5o",
    authDomain: "blogging-app-a9b16.firebaseapp.com",
    projectId: "blogging-app-a9b16",
    storageBucket: "blogging-app-a9b16.appspot.com",
    messagingSenderId: "406573600119",
    appId: "1:406573600119:web:84e441ef511f53ea29a572"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  app,
  db,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getAuth,
  createUserWithEmailAndPassword,
  query,
  where,
  getDocs,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  
  
};
