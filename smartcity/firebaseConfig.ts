import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDUJIn0-vT9gCy92uoer9OQCk7ct-PxT6c",
  authDomain: "akillisehir-20ad9.firebaseapp.com",
  projectId: "akillisehir-20ad9",
  storageBucket: "akillisehir-20ad9.firebasestorage.app",
  messagingSenderId: "2757982465",
  appId: "1:2757982465:web:cefe7024c6ae67e16cc300",
  measurementId: "G-7F5GDNS629"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };