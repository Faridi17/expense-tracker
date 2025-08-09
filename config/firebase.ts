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
  // config
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Tentukan apakah menggunakan persistence khusus di React Native
export const auth = Platform.OS === "web"
  ? getAuth(app)  
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) }); 



// Firestore
export const firestore = getFirestore(app);
