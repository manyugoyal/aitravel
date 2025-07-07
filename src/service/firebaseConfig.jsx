// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics"; 

const firebaseConfig = {
  apiKey: "AIzaSyCQbx_SoLd_2g35C6Oq8s0N2qXA0BLriZY",
  authDomain: "travel-1d156.firebaseapp.com",
  projectId: "travel-1d156",
  storageBucket: "travel-1d156.appspot.com", 
  messagingSenderId: "413197910426",
  appId: "1:413197910426:web:8298356cf27a7beeac3a23",
  measurementId: "G-PXY38VW1KE",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const provider = new GoogleAuthProvider(); 
