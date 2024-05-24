// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDugx6demi0JVPFP5WZxP_fHu_0jtos1Jc",
    authDomain: "quiz-3-0.firebaseapp.com",
    projectId: "quiz-3-0",
    storageBucket: "quiz-3-0.appspot.com",
    messagingSenderId: "892635316364",
    appId: "1:892635316364:web:01d2e3158679e46700bba9",
    measurementId: "G-D1L43DQQEE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
