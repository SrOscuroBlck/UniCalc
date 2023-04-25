// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore, collection, setDoc, doc, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA78ns65TuK1Fe_v4Z3srVQ1hYpDw11T1E",
  authDomain: "unicalcweb.firebaseapp.com",
  projectId: "unicalcweb",
  storageBucket: "unicalcweb.appspot.com",
  messagingSenderId: "788553808636",
  appId: "1:788553808636:web:d7461b986f79e04b5bf579",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const createUserDocs = async (user, userName, photo) => {
  if (!user) {
    return;
  }

  let displayName;
  let photoURL;

  if (userName) {
    displayName = userName;
  } else {
    displayName = user.displayName;
  }

  if (photo) {
    photoURL = photo;
  } else {
    photoURL = user.photoURL;
  }

  const userRef = doc(collection(db, "Registers"), user.uid);

  try {
    await setDoc(userRef, {
      email: user.email,
      name: displayName,
      photo: photoURL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRegisters = async () => {
  const registersReference = collection(db, "Registers");
  const snapshot = await getDocs(registersReference);
  const registers = snapshot.docs.map((document) => ({
    ...document.data(),
    id: document.id,
  }));
  return registers;
};
