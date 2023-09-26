// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB83XxvwMGXhUVxdCqepUA24Qsf_ZIJiRg",
    authDomain: "parkit-a8cb0.firebaseapp.com",
    databaseURL: "https://parkit-a8cb0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "parkit-a8cb0",
    storageBucket: "parkit-a8cb0.appspot.com",
    messagingSenderId: "345022933810",
    appId: "1:345022933810:web:e774d284be2066f275852b"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

var database = getDatabase(app);
 
export default database;