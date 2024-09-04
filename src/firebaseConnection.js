import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCs1Sd-pCwAqFasEtNE5Y7ZbJoWs3DYsdQ",
  authDomain: "persistencia-50cc2.firebaseapp.com",
  projectId: "persistencia-50cc2",
  storageBucket: "persistencia-50cc2.appspot.com",
  messagingSenderId: "292410502455",
  appId: "1:292410502455:web:4b55f4fa77b0654d8cfeb2"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };