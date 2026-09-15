import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyD88lSrTFegwEJm2ik8kSEjoD8dMRsy_Ls",
    authDomain: "lec18-task.firebaseapp.com",
    projectId: "lec18-task",
    storageBucket: "lec18-task.firebasestorage.app",
    messagingSenderId: "100539098210",
    appId: "1:100539098210:web:2407aff8b52ef30e775d3b",
    measurementId: "G-2BQQ03GVS1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);