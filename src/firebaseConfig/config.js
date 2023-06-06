// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore, collection, setDoc, doc, getDocs, onSnapshot, deleteDoc } from "firebase/firestore";

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

// create user subject in firestore

export const createSubject = async (
  user,
  subject,
  credits,
  firstCut = -1,
  secondCut = -1,
  thirdCut = -1
) => {
  if (!user) {
    return;
  }

  const subjectRef = doc(collection(db, "Registers"), user.uid, "subjects", subject);

  try {
    await setDoc(subjectRef, {
      subject,
      credits,
      firstCut,
      secondCut,
      thirdCut,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSubjects = async (user) => {
  if (!user) {
    return null;
  }
  const subjectRef = collection(db, "Registers", user.uid, "subjects");

  try {
    const snapshot = await getDocs(subjectRef);
    console.log(snapshot);
    const subjects = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    console.log(subjects);
    return subjects;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const subscribeToSubjects = (user, callback) => {
  if (!user) {
    return null;
  }
  const subjectRef = collection(db, "Registers", user.uid, "subjects");

  return onSnapshot(subjectRef, (snapshot) => {
    const subjects = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    callback(subjects);
  });
};

export const deleteSubject = async (user, subject) => {
  if (!user) {
    return null;
  }
  const subjectRef = doc(collection(db, "Registers", user.uid, "subjects"), subject);

  try {
    await deleteDoc(subjectRef);
  } catch (error) {
    console.log(error);
  }
};

export const editSubject = async (
  user,
  subjectChange,
  subject,
  credits = 0,
  firstCut = -1,
  secondCut = -1,
  thirdCut = -1
) => {
  if (!user) {
    return;
  }

  const subjectRef = doc(collection(db, "Registers", user.uid, "subjects"), subjectChange);

  try {
    await setDoc(subjectRef, {
      subject,
      credits,
      firstCut,
      secondCut,
      thirdCut,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const getRegisters = async () => {
//     const registersReference = collection(db, "Registers");
//     const snapshot = await getDocs(registersReference);
//     const registers = snapshot.docs.map((doc) =>  {
//         return {
//             ...doc.data()
//         }
//     })
//     return registers;
// }
