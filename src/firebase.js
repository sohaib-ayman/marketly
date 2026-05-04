import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBjQ82IFbjiTd5cDh0cdg3-qYtpZRVZkCE",
    authDomain: "marketly-f10e8.firebaseapp.com",
    projectId: "marketly-f10e8",
    storageBucket: "marketly-f10e8.firebasestorage.app",
    messagingSenderId: "687537722284",
    appId: "1:687537722284:web:1ea06c35eafbb04035a009",
    measurementId: "G-GJP6NL00LF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const analytics = getAnalytics(app);