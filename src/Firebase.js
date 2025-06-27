

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyBqD7_q9n5m31EOEJNef9_clJW19ex99pA",
    authDomain: "maktrip-1cc02.firebaseapp.com",
    projectId: "maktrip-1cc02",
    storageBucket: "maktrip-1cc02.firebasestorage.app",
    messagingSenderId: "442854202376",
    appId: "1:442854202376:web:483fbf2c967ef88091c5bd",
    measurementId: "G-LZ1FQ7FFZE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
