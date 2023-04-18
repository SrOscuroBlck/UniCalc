import { createContext, useContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth, createUserDocs } from "../firebase/config";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signUp = async (email, password, userName) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocs(user, userName);
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        createUserDocs(result.user);
        console.log(result.user);
        return true; // return a value to indicate successful authentication
      })
      .catch((error) => {
        throw error; // re-throw the error to be handled by the caller
      });
  };

  const loginWithGithub = () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider)
      .then(() => {
        createUserDocs(currentUser);
        return true; // return a value to indicate successful authentication
      })
      .catch((error) => {
        throw error; // re-throw the error to be handled by the caller
      });
  };

  const loginWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        createUserDocs(result.user);
        console.log(result);
        console.log(result.user);
        return true; // return a value to indicate successful authentication
      })
      .catch((error) => {
        throw error; // re-throw the error to be handled by the caller
      });
  };

  const authContextValue = useMemo(
    () => ({
      signUp,
      login,
      user: currentUser,
      logout,
      loginWithGoogle,
      loginWithGithub,
      loginWithFacebook,
      loading,
      resetPassword,
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
