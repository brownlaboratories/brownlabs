import React, { useEffect, useState, createContext } from 'react';
import { auth } from './firebase';
import { CircularProgress } from '@mui/material';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <CircularProgress/> // or return a loading spinner
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
