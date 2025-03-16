import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD-O9Mb5yx0sciUodxMYUp9aY01axnPpY",
  authDomain: "expense-tracker-89b4b.firebaseapp.com",
  projectId: "expense-tracker-89b4b",
  storageBucket: "expense-tracker-89b4b.firebasestorage.app",
  messagingSenderId: "357120143142",
  appId: "1:357120143142:web:e2b89b232b6bce73d25be7",
  measurementId: "G-F3JSXHCB8E"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Tentukan apakah menggunakan persistence khusus di React Native
export const auth = Platform.OS === "web"
  ? getAuth(app)  
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) }); 



// Firestore
export const firestore = getFirestore(app);
