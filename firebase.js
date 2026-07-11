import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBK-gelGDcmWMzIOccm9Go9Y7nXY-yiGz4",
  authDomain: "shreeshyamrakhi-5ab8a.firebaseapp.com",
  projectId: "shreeshyamrakhi-5ab8a",
  storageBucket: "shreeshyamrakhi-5ab8a.firebasestorage.app",
  messagingSenderId: "1022221508957",
  appId: "1:1022221508957:web:c1137b68a1add9d89f48b4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };