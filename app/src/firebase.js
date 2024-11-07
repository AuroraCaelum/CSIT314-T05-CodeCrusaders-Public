// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDAX9kyVTzB-rc_qX7h_Mo76nDTSpFuaks",
    authDomain: "moeuigosa-encjrx.firebaseapp.com",
    databaseURL: "https://moeuigosa-encjrx.firebaseio.com",
    projectId: "moeuigosa-encjrx",
    storageBucket: "moeuigosa-encjrx.appspot.com",
    messagingSenderId: "940324999117",
    appId: "1:940324999117:web:93608ac90bd8587847fe84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Database
const db = getFirestore(app);

// Storage
const storage = getStorage(app);

export { db, storage };