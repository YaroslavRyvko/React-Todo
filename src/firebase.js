// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCv8B4bFwcSNhJV6aALIdMq7JX7czSEijM",
  authDomain: "todolist-cf375.firebaseapp.com",
  projectId: "todolist-cf375",
  storageBucket: "todolist-cf375.appspot.com",
  messagingSenderId: "928595584509",
  appId: "1:928595584509:web:0167708dc6d66f904f6594",
  measurementId: "G-MJ13MJXY40",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
