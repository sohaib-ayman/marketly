// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBjQ82IFbjiTd5cDh0cdg3-qYtpZRVZkCE",
    authDomain: "marketly-f10e8.firebaseapp.com",
    projectId: "marketly-f10e8",
    storageBucket: "marketly-f10e8.firebasestorage.app",
    messagingSenderId: "687537722284",
    appId: "1:687537722284:web:1ea06c35eafbb04035a009",
    measurementId: "G-GJP6NL00LF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);