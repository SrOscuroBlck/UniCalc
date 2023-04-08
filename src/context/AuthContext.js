import { createContext, useContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
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

  const signUp = async (email, password) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocs(user);
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authContextValue = useMemo(
    () => ({
      signUp,
      login,
      user: currentUser,
      logout,
      loading,
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
