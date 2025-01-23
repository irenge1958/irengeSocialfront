// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXeYZaQECMK6JeC8wzyZtbE9Igg94S2Uc",
  authDomain: "videoy-65ca9.firebaseapp.com",
  projectId: "videoy-65ca9",
  storageBucket: "videoy-65ca9.appspot.com",
  messagingSenderId: "446639249312",
  appId: "1:446639249312:web:183ac29fbc1ed23df136c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const provider=new GoogleAuthProvider()
export default app