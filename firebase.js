import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmMuPMsRJP143zDJgQ5HYXmUhMgoP29_E",
  authDomain: "shree-shyam-rakhi.firebaseapp.com",
  projectId: "shree-shyam-rakhi",
  storageBucket: "shree-shyam-rakhi.firebasestorage.app",
  messagingSenderId: "857832383228",
  appId: "1:857832383228:web:85855f6bd4207c72b92d79"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };