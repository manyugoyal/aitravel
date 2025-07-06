// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQbx_SoLd_2g35C6Oq8s0N2qXA0BLriZY",
  authDomain: "travel-1d156.firebaseapp.com",
  projectId: "travel-1d156",
  storageBucket: "travel-1d156.firebasestorage.app",
  messagingSenderId: "413197910426",
  appId: "1:413197910426:web:8298356cf27a7beeac3a23",
  measurementId: "G-PXY38VW1KE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
